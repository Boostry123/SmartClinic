import { Router } from "express";
// prefer importing the TS module path (remove or keep .js depending on your runtime/tsconfig)
import { UserService } from "../services/userService.js";
import { authMiddleware } from "../middleware/auth.js";
import { getSupabaseClient } from "../config/supaDb.js";
import { createNewUser } from "../controllers/usersController.js";
import { logInfo, logError } from "../utils/logger.js";
//types
import userTypes from "../types/enums/userTypes.js";
import type { AuthRequest } from "../middleware/auth.js";
import { LogEntityType } from "../types/logs.js";
import LogAction from "../types/enums/logActions.js";

const UserRoutes = Router();

const { getUsersByRole } = UserService;
// Define a route to get all patients
//EXAMPLE : http://localhost:3001/users?role=patient
UserRoutes.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const userRole = req.query.role as string;
  const token: string = req.token!;
  let userId = "unknown";

  try {
    const supabase = getSupabaseClient(token);
    const { data: userData } = await supabase.auth.getUser();
    userId = userData?.user?.id || "unknown";

    //  RUNTIME VALIDATION: Check if the string actually exists in your enum values
    // We check if 'userRole' is NOT included in the list of valid userTypes
    if (
      !userRole ||
      !Object.values(userTypes).includes(userRole as userTypes)
    ) {
      return res.status(400).json({
        error: `Invalid role. Allowed values: ${Object.values(userTypes).join(
          ", ",
        )}`,
      });
    }

    // Now it is safe to use
    const safeRole = userRole as userTypes;

    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized" });
    }

    const { data, error } = await getUsersByRole(supabase, safeRole);
    if (error) {
      throw error;
    }

    await logInfo({
      userId,
      action: LogAction.FETCH_USERS,
      entityType: LogEntityType.USER,
      metadata: { role: safeRole },
    });

    res.json(data);
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Fetching users failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.FETCH_USERS_FAILED,
      entityType: LogEntityType.USER,
      metadata: { error: errorMessage, role: userRole },
    });

    res.status(500).json({ error: errorMessage });
  }
});

// ... imports

UserRoutes.post("/create", authMiddleware, async (req: AuthRequest, res) => {
  const token = req.token!;
  let callerId = "unknown";

  try {
    // 1. INPUT VALIDATION
    const {
      email,
      password,
      role,
      name,
      last_name,
      national_id_number,
      doctor_id, // Admin provides this. Doctor does not need to. NEEDED FOR SECRETARY ROLE ONLY
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // ... (Enum checks remain the same) ...

    // 2. PERMISSION CHECK
    const callerClient = getSupabaseClient(token);
    const {
      data: { user: caller },
      error: authError,
    } = await callerClient.auth.getUser();

    if (authError || !caller) {
      return res.status(401).json({ error: "Invalid session." });
    }
    callerId = caller.id;

    // Get Caller Profile (Check if Admin or Doctor)
    const { data: callerProfile } = await callerClient
      .from("users")
      .select("role")
      .eq("id", caller.id) // This is the auth.users ID
      .single();

    if (!callerProfile || !["admin", "doctor"].includes(callerProfile.role)) {
      return res
        .status(403)
        .json({ error: "Access Denied: Insufficient permissions." });
    }

    // 3. SECRETARY LOGIC (The Fix)
    let assignedDoctorId = undefined;

    if (role === "secretary") {
      if (callerProfile.role === "doctor") {
        // A. If Caller is Doctor: LOOKUP their actual doctor_id
        const { data: doctorRecord, error: docError } = await callerClient
          .from("doctors")
          .select("id")
          .eq("user_id", caller.id) // Find the doctor row linked to this user
          .single();

        if (docError || !doctorRecord) {
          return res
            .status(404)
            .json({ error: "Doctor profile not found for this user." });
        }

        assignedDoctorId = doctorRecord.id; // USE THIS ID, not caller.id
      } else if (callerProfile.role === "admin") {
        // B. If Caller is Admin: They must provide the ID manually
        if (!doctor_id) {
          return res.status(400).json({
            error: "Admin must provide 'doctor_id' when creating a secretary.",
          });
        }
        assignedDoctorId = doctor_id;
      }
    }

    // 4. EXECUTION
    const newUser = await createNewUser(
      {
        email,
        password,
        role,
        name,
        last_name,
        national_id_number,
        doctor_id: assignedDoctorId, // Pass the correctly looked-up ID
      },
      caller.id,
    );

    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (err: any) {
    const errorMessage = err.message ?? "Internal Server Error";
    console.error(`Create user failed: ${errorMessage}`);

    await logError({
      userId: callerId,
      action: LogAction.CREATE_USER_FAILED,
      entityType: LogEntityType.USER,
      metadata: { error: errorMessage, body: req.body },
    });

    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: errorMessage });
  }
});

export default UserRoutes;

import { Router } from "express";
// prefer importing the TS module path (remove or keep .js depending on your runtime/tsconfig)
import { UserService } from "../services/userService.js";
import { authMiddleware } from "../middleware/auth.js";
import { getSupabaseClient } from "../config/supaDb.js";
import { createNewUser } from "../controllers/usersController.js";
//types
import userTypes from "../types/enums/userTypes.js";
import type { AuthRequest } from "../middleware/auth.js";

const UserRoutes = Router();

const { getUsersByRole } = UserService;
// Define a route to get all patients
//EXAMPLE : http://localhost:3001/users?role=patient
UserRoutes.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const userRole = req.query.role as string;
  const token: string = req.token!;

  try {
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
    const supabase = getSupabaseClient(token);

    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized" });
    }

    const { data, error } = await getUsersByRole(supabase, safeRole);
    if (error) {
      throw error;
    }

    res.json(data);
  } catch (err: any) {
    console.error(`Fetching users failed: ${err?.message ?? err}`);
    res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
});

UserRoutes.post("/create", authMiddleware, async (req: AuthRequest, res) => {
  const token = req.token!; // Guaranteed by authMiddleware

  try {
    // ==========================================
    // 1. INPUT VALIDATION
    // ==========================================
    const { email, password, role, name, last_name, national_id_number } =
      req.body;

    // A. Check required fields
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Missing required fields (email, password, role)." });
    }

    // B. Check Enum Validity (Using your userTypes)
    if (!Object.values(userTypes).includes(role as userTypes)) {
      return res.status(400).json({
        error: `Invalid role. Allowed values: ${Object.values(userTypes).join(", ")}`,
      });
    }

    // ==========================================
    // 2. PERMISSION CHECK
    // ==========================================
    const callerClient = getSupabaseClient(token);

    // Get the caller's ID
    const {
      data: { user: caller },
      error: authError,
    } = await callerClient.auth.getUser();
    if (authError || !caller) {
      return res.status(401).json({ error: "Invalid session." });
    }

    // Check the caller's Role in public.users
    const { data: callerProfile } = await callerClient
      .from("users")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (!callerProfile || !["admin", "doctor"].includes(callerProfile.role)) {
      return res
        .status(403)
        .json({ error: "Access Denied: Insufficient permissions." });
    }
    if (role === "admin" && callerProfile.role !== "admin") {
      return res
        .status(403)
        .json({
          error:
            "Access Denied: Insufficient permissions. Only Admin can make a new Admin user instance",
        });
    }

    // ==========================================
    // 3. EXECUTION (The "Action")
    // ==========================================
    // If we passed all checks, we call the controller
    const newUser = await createNewUser({
      email,
      password,
      role,
      name,
      last_name,
      national_id_number,
    });

    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (err: any) {
    console.error(`Create user failed: ${err.message}`);
    // Handle Supabase errors (like "User already exists") gracefully
    const statusCode = err.status || 500;
    res
      .status(statusCode)
      .json({ error: err.message ?? "Internal Server Error" });
  }
});

export default UserRoutes;

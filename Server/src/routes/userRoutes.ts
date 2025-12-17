import { Router } from "express";
// prefer importing the TS module path (remove or keep .js depending on your runtime/tsconfig)
import { UserService } from "../services/userService.js";
import { authMiddleware } from "../middleware/auth.js";
import { getSupabaseClient } from "../config/supaDb.js";
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
          ", "
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

export default UserRoutes;

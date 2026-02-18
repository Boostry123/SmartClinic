import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
//Controllers
import { getSecretaries } from "../controllers/secretariesController.js";
//Types
import type { AuthRequest } from "../middleware/auth.js";
import type { secretaryFilterTypes } from "../types/enums/secretary.js";

const SecretaryRoutes = Router();

SecretaryRoutes.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const token = req.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const rawQuery = req.query as any;
  //  CLEANUP & VALIDATION START
  const cleanFilter: Partial<secretaryFilterTypes> = {};

  for (const key of Object.keys(rawQuery)) {
    // A. Check if the key is allowed

    const value = rawQuery[key as keyof secretaryFilterTypes];

    // B. Trim strings and ignore if empty
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      // Only add to cleanFilter if it has content
      if (trimmedValue.length > 0) {
        (cleanFilter as any)[key] = trimmedValue;
      }
    }
    // C. Preserve non-string values if they exist
    else if (value !== undefined && value !== null) {
      (cleanFilter as any)[key] = value;
    }
  }

  try {
    // Pass the `cleanFilter` which now only contains valid, non-empty keys
    const { data, error } = await getSecretaries(
      token,
      cleanFilter as secretaryFilterTypes
    );

    if (error) {
      throw error;
    }
    return res.json(data);
  } catch (error: any) {
    console.error(`Fetching patients failed:`, error);
    return res.status(500).json({ error: error || "Unknown error" });
  }
});

export default SecretaryRoutes;

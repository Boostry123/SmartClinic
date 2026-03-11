import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getPatients } from "../controllers/patientsController.js";
// types
import type { AuthRequest } from "../middleware/auth.js";
import type { patientFilterTypes } from "../types/enums/patientTypes.js";
import type { doctorFilterTypes } from "../types/enums/doctorTypes.js";
import { getDoctors } from "../controllers/doctorsController.js";

const DoctorRoutes = Router();

const ALLOWED_FILTERS = ["id", "user_id", "national_id_number"];

DoctorRoutes.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const rawQuery = req.query as doctorFilterTypes;
  const token = req.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  //  CLEANUP & VALIDATION START
  const cleanFilter: Partial<doctorFilterTypes> = {};

  for (const key of Object.keys(rawQuery)) {
    // A. Check if the key is allowed
    if (!ALLOWED_FILTERS.includes(key)) {
      return res.status(400).json({ error: `Invalid filter key: ${key}` });
    }

    const value = rawQuery[key as keyof doctorFilterTypes];

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
    const { data, error } = await getDoctors(
      token,
      cleanFilter as patientFilterTypes,
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

export default DoctorRoutes;

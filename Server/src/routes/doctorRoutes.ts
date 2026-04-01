import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

// types
import type { AuthRequest } from "../middleware/auth.js";
import type {
  doctorFilterTypes,
  DoctorUpdate,
} from "../types/enums/doctorTypes.js";
//controllers
import { getDoctors, updateDoctor } from "../controllers/doctorsController.js";

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
      cleanFilter as doctorFilterTypes,
    );

    if (error) {
      throw error;
    }
    return res.json(data);
  } catch (error: any) {
    console.error(`Fetching doctors failed:`, error);
    return res.status(500).json({ error: error || "Unknown error" });
  }
});

//updating
DoctorRoutes.patch("/", authMiddleware, async (req: AuthRequest, res) => {
  const token = req.token;
  const data = req.body as DoctorUpdate;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (!data.id || !data.user_id) {
    return res
      .status(400)
      .json({ error: "Doctor ID and User ID are required" });
  }

  try {
    const { data: updatedDoctor, error } = await updateDoctor(token, data);

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json(updatedDoctor);
  } catch (error: any) {
    console.error(`Updating doctor failed:`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default DoctorRoutes;

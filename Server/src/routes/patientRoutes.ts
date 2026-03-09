import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getPatients,
  getPatientsByIds,
  updatePatient,
} from "../controllers/patientsController.js";
// types
import type { AuthRequest } from "../middleware/auth.js";
import type {
  patientByIdsFilterTypes,
  patientFilterTypes,
  PatientUpdate,
} from "../types/enums/patientTypes.js";

const PatientRoutes = Router();

const ALLOWED_FILTERS = [
  "patient_id",
  "user_id",
  "national_id_number",
  "first_name",
  "last_name",
  "phone_number",
];

const ALLOWED_IDS_FILTERS = ["patient_id"];

PatientRoutes.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const rawQuery = req.query as patientFilterTypes;
  const token = req.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  //  CLEANUP & VALIDATION START
  const cleanFilter: Partial<patientFilterTypes> = {};

  for (const key of Object.keys(rawQuery)) {
    // A. Check if the key is allowed
    if (!ALLOWED_FILTERS.includes(key)) {
      return res.status(400).json({ error: `Invalid filter key: ${key}` });
    }

    const value = rawQuery[key as keyof patientFilterTypes];

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
    const { data, error } = await getPatients(
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

PatientRoutes.get("/byIds", authMiddleware, async (req: AuthRequest, res) => {
  const rawQuery = req.query;
  const token = req.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  //  CLEANUP & VALIDATION START
  const cleanFilter: patientByIdsFilterTypes = {};

  // Axios might serialize as patient_id or patient_id[]
  const rawPatientIds = rawQuery.patient_id || rawQuery["patient_id[]"];

  if (rawPatientIds) {
    // Ensure patient_id is an array
    const patientIds = Array.isArray(rawPatientIds)
      ? (rawPatientIds as string[])
      : [(rawPatientIds as string)];

    // Filter out empty strings and trim
    cleanFilter.patient_id = patientIds
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }

  try {
    const { data, error } = await getPatientsByIds(token, cleanFilter);

    if (error) {
      throw error;
    }
    return res.json(data);
  } catch (error: any) {
    console.error(`Fetching patients by IDs failed:`, error);
    return res.status(500).json({ error: error || "Unknown error" });
  }
});

PatientRoutes.patch("/", authMiddleware, async (req: AuthRequest, res) => {
  const token = req.token;
  const data = req.body as PatientUpdate;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (!data.patient_id) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    const { data: updatedPatient, error } = await updatePatient(token, data);

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json(updatedPatient);
  } catch (error: any) {
    console.error(`Updating patient failed:`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default PatientRoutes;

import { Router } from "express";
// prefer importing the TS module path (remove or keep .js depending on your runtime/tsconfig)

import { authMiddleware } from "../middleware/auth.js";
import { getPatients } from "../controllers/patientsController.js";
//types
import type { AuthRequest } from "../middleware/auth.js";
import type { patientFilterTypes } from "../types/enums/patientTypes.js";

const PatientRoutes = Router();
// Define a route to get all patients
//EXAMPLE : http://localhost:3001/users?pateint_id="patient_id"&user_id="user_id"&national_id="national_id"&first_name="first_name"&last_name="last_name"&phone_number="phone_number"
PatientRoutes.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const filter = req.query as patientFilterTypes;
  const token: string = req.token!;
  const ALLOWED_FILTERS = [
    "patient_id",
    "user_id",
    "national_id",
    "first_name",
    "last_name",
    "phone_number",
  ];
  //validate token
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  //trimming whitespaces from string filters, and validating legality of filters
  Object.keys(filter).forEach((key) => {
    const value = filter[key as keyof patientFilterTypes];
    if (typeof value === "string") {
      filter[key as keyof patientFilterTypes] = value.trim();
      if (!ALLOWED_FILTERS.includes(key as any)) {
        return res.status(400).json({ error: `Invalid filter key: ${key}` });
      }
    }
  });
  //validate that at least one filter is provided
  if (Object.keys(filter).length === 0) {
    return res
      .status(400)
      .json({ error: "At least one filter must be provided." });
  }

  try {
    const data = await getPatients(token, filter);
    return res.json(data);
  } catch (error) {}
});

export default PatientRoutes;

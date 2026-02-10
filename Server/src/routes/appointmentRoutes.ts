import { Router } from "express";
//Controllers
import {
  createAppointment,
  getAppointments,
  updateAppointment,
} from "../controllers/appointmentsController.js";
import { authMiddleware } from "../middleware/auth.js";
//Types

import type {
  AppointmentFilters,
  AppointmentStatus,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../types/enums/appointmentTypes.js";

const AppointmentRoutes = Router();

// Create Appointment
AppointmentRoutes.post("/", authMiddleware, async (req: any, res) => {
  const token = req.token;
  const body: CreateAppointmentDTO = req.body;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  // Basic validation
  if (!body.start_time || !body.patient_id || !body.doctor_id) {
    return res.status(400).json({
      error:
        "Missing required appointment fields, Must include scheduled time , patient id and doctor id",
    });
  }

  try {
    const { data, error } = await createAppointment(token, body);
    if (error) return res.status(400).json({ error });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

AppointmentRoutes.patch("/", authMiddleware, async (req: any, res) => {
  const token = req.token;
  const { id } = req.body;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  if (!id) {
    return res
      .status(400)
      .json({ error: "Appointment ID is required in the body" });
  }

  try {
    const { data, error } = await updateAppointment(
      token,
      req.body as UpdateAppointmentDTO
    );

    if (error) return res.status(400).json({ error });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
AppointmentRoutes.get("/", authMiddleware, async (req: any, res) => {
  const token = req.token;

  // Extract filters from query params
  const filters: AppointmentFilters = {
    id: req.query.id as string,
    status: req.query.status as AppointmentStatus,
    patient_id: req.query.patient_id as string,
    doctor_id: req.query.doctor_id as string,
    start_time: req.query.start_time as string, //ISO
    end_time: req.query.end_time as string, //ISO
  };

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data, error } = await getAppointments(token, filters);
    if (error) return res.status(400).json({ error });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default AppointmentRoutes;

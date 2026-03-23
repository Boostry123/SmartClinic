import { Router } from "express";
import upload from "../middleware/multer.js";
//Controllers
import {
  createAppointment,
  getAppointments,
  updateAppointment,
} from "../controllers/appointmentsController.js";
import { authMiddleware } from "../middleware/auth.js";
import { getDoctors } from "../controllers/doctorsController.js";
//Types
import type {
  AppointmentFilters,
  AppointmentStatus,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../types/enums/appointmentTypes.js";
//Middleware
import type { MulterRequest } from "../middleware/multer.js";
//services
import { getUserDetails } from "../services/auth.js";

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

AppointmentRoutes.patch(
  "/",
  authMiddleware,
  upload.any(),
  async (req: any, res) => {
    const multerReq = req as MulterRequest;
    const token = req.token;
    const { id } = multerReq.body;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    if (!id) {
      return res
        .status(400)
        .json({ error: "Appointment ID is required in the body" });
    }
    // Get the doctors id using token and check if the doctor is the same the one in the appointment
    const userDetails = await getUserDetails(token);
    if (userDetails.error || userDetails.data.user === null) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const doctorUserId = userDetails.data.user?.id;
    const appointment = await getAppointments(token, {
      id,
    } as AppointmentFilters);
    if (appointment.error || appointment.data.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    const doctorId = await getDoctors(token, { user_id: doctorUserId });
    if (doctorId.error || doctorId.data.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    if (appointment.data[0].doctor_id !== doctorId.data[0].id) {
      return res.status(403).json({
        error: "Forbidden: You can only update your own appointments",
      });
    }

    try {
      const { data, error } = await updateAppointment(
        token,
        multerReq.body as UpdateAppointmentDTO,
        multerReq.files,
      );
      if (error) return res.status(400).json({ error });

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("DEBUG - Full Error:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  },
);
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

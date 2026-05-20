import { z } from "zod";
import { toolDefinition } from "@tanstack/ai";
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentDTO,
} from "../types/enums/appointmentTypes.js";
import {
  createAppointment,
  getAppointments,
} from "../controllers/appointmentsController.js";
//services
import { getUserDetails } from "../services/auth.js";

export const getAppointmentsToolDef = toolDefinition({
  name: "fetch_appointments",
  // Improved description to tell the AI it's for searching/filtering
  description:
    "Search and retrieve clinic appointments filterable by date range, patient, or status.",
  inputSchema: z.object({
    id: z.string().optional(),
    status: z
      .enum(["scheduled", "confirmed", "checked_in", "completed", "cancelled"])
      .optional(),
    patient_id: z.string().optional(),
    doctor_id: z.string().optional(),
    start_time: z
      .string()
      .optional()
      .describe(
        "The beginning of the search period in ISO format (e.g., the start of today or the start of next week).",
      ),
    end_time: z
      .string()
      .optional()
      .describe(
        "The end of the search period in ISO format (e.g., the end of today or the end of next week).",
      ),
    room_id: z.string().optional(),
  }),
  outputSchema: z.object({
    appointments: z.array(
      z.object({
        id: z.string().describe("unique identifier for the appointment"),
        patient_id: z.string(),
        doctor_id: z.string(),
        treatment_id: z.string(),
        treatment_data: z.record(z.string(), z.any()),
        start_time: z.string(),
        end_time: z.string(),
        status: z
          .enum([
            "scheduled",
            "confirmed",
            "checked_in",
            "completed",
            "cancelled",
          ])
          .optional(),
        notes: z.string(),
        created_at: z.string(),
        room_id: z.string().nullable().optional(),
        patients: z.object({
          first_name: z.string(),
          last_name: z.string(),
        }),
        doctors: z.object({
          specialization: z.string(),
          users: z.object({
            name: z.string(),
            last_name: z.string(),
            email: z.string(),
          }),
        }),
      }),
    ),
  }),
});

export const getAppointmentsTool = (token: string) =>
  getAppointmentsToolDef.server(async (args) => {
    try {
      let userId = "unknown";
      const { data: userData } = await getUserDetails(token);
      userId = userData?.user?.id || "unknown";

      const filters = {
        ...(args as Record<string, any>),
      } as AppointmentFilters;

      const { data, error } = await getAppointments(token, filters);

      if (error || !data) {
        throw error;
      }

      // ----------------------------------------------
      return {
        appointments: data.map((appt: Appointment) => ({
          id: appt.id,
          patient_id: appt.patient_id,
          doctor_id: appt.doctor_id,
          treatment_id: appt.treatment_id,
          treatment_data: appt.treatment_data || {},
          start_time: appt.start_time,
          end_time: appt.end_time,
          status: appt.status,
          notes: appt.notes || "",
          created_at: appt.created_at,
          room_id: appt.room_id,
          patients: {
            first_name: appt.patients?.first_name || "",
            last_name: appt.patients?.last_name || "",
          },
          doctors: {
            specialization: appt.doctors?.specialization || "",
            users: {
              name: appt.doctors?.users?.name || "",
              last_name: appt.doctors?.users?.last_name || "",
              email: appt.doctors?.users?.email || "",
            },
          },
        })),
      };
    } catch (error: any) {
      const errorMessage = error?.message ?? "Unknown error";
      console.error("Tool Error:", errorMessage);

      throw new Error(`Failed to fetch appointments: ${errorMessage}`);
    }
  });

export const createAppointmentToolDef = toolDefinition({
  name: "create_appointment",
  description:
    "Create a new appointment with specified details. Important: things like Ids most likely were not given, use other tools to get them by the given information.",
  inputSchema: z.object({
    patient_id: z
      .string()
      .describe("ID of the patient to schedule the appointment for."),
    doctor_id: z.string(),
    treatment_id: z
      .string()
      .describe("Treatment is most likely given by name, find the ID"),
    treatment_data: z
      .string()
      .describe(
        'A stringified JSON object representing treatment details (e.g., \'{"tooth": 14, "notes": "root canal"}\')',
      ),
    start_time: z
      .string()
      .describe("Start time of the appointment in ISO format."),
    end_time: z.string().describe("end time of the appointment in ISO format."),
  }),
  outputSchema: z.object({
    id: z.string(),
    patient_id: z.string(),
    doctor_id: z.string(),
    treatment_id: z.string(),
    treatment_data: z.record(z.string(), z.any()),
    start_time: z.string(),
    end_time: z.string(),
    status: z.enum([
      "scheduled",
      "confirmed",
      "checked_in",
      "completed",
      "cancelled",
    ]),
    notes: z.string(),
    created_at: z.string(),
    room_id: z.string().nullable().optional(),
    patients: z.object({
      first_name: z.string(),
      last_name: z.string(),
    }),
    doctors: z.object({
      specialization: z.string(),
      users: z.object({
        name: z.string(),
        last_name: z.string(),
        email: z.string(),
      }),
    }),
  }),
});

export const createAppointmentsTool = (token: string) =>
  createAppointmentToolDef.server(async (args: any) => {
    try {
      let userId = "unknown";
      const { data: userData } = await getUserDetails(token);
      userId = userData?.user?.id || "unknown";
      let parsedTreatmentData = {};
      if (args.treatment_data) {
        try {
          parsedTreatmentData = JSON.parse(args.treatment_data);
        } catch (parseError) {
          console.error(
            "Failed to parse treatment_data object, using empty map:",
            parseError,
          );
        }
      }
      const filters = {
        ...(args as Record<string, any>),
      } as CreateAppointmentDTO;

      const { data, error } = await createAppointment(token, filters);

      if (error || !data) {
        throw error;
      }
    } catch (error: any) {
      const errorMessage = error?.message ?? "Unknown error";
      console.error("Tool Error:", errorMessage);

      throw new Error(`Failed to fetch appointments: ${errorMessage}`);
    }
  });

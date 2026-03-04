import { z } from "zod";
//tanstack AI
import { toolDefinition } from "@tanstack/ai";

export const getAppointmentsToolDef = toolDefinition({
  name: "fetch_appointments",
  description: "Retrieve clinic appointments",
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
      .describe("specific scheduled date and time in ISO format"),
    end_time: z
      .string()
      .optional()
      .describe(
        "specific calculated end time according to the treatment duration in ISO format",
      ),
  }),
  outputSchema: z.object({
    appointments: z.array(
      z.object({
        id: z.string().describe("unique identifier for the appointment"),
        patient_id: z
          .string()
          .describe("ID of the patient associated with the appointment"),
        doctor_id: z
          .string()
          .describe("ID of the doctor associated with the appointment"),
        treatment_id: z
          .string()
          .describe("ID of the treatment associated with the appointment"),
        treatment_data: z
          .record(z.string(), z.any())
          .describe(
            "data that was filled in by the doctor according to the treatment form",
          ),
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
          .describe(
            "current status of the appointment, scheduled means it's upcoming, completed means it allready happened, cancelled means it was cancelled, checked_in means the patient already checked in the clinic, confirmed means the doctor already confirmed the appointment",
          ),
        notes: z.string().describe("any additional notes for the appointment"),
        created_at: z
          .string()
          .describe("the date and time when the appointment was created"),
        patients: z.object({
          first_name: z.string().describe("first name of the patient"),
          last_name: z.string().describe("last name of the patient"),
        }),
        doctors: z.object({
          specialization: z.string().describe("specialization of the doctor"),
          users: z.object({
            name: z.string().describe("first name of the doctor"),
            last_name: z.string().describe("last name of the doctor"),
            email: z.string().describe("email of the doctor"),
          }),
        }),
      }),
    ),
  }),
});

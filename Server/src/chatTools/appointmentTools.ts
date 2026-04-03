import { z } from "zod";
import { toolDefinition } from "@tanstack/ai";

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

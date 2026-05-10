import { getPatients } from "../controllers/patientsController.js";
import { z } from "zod";
import { toolDefinition } from "@tanstack/ai";
import type {
  Patient,
  patientFilterTypes,
} from "../types/enums/patientTypes.js";

export const getPatientsToolDef = toolDefinition({
  name: "fetch_patients",
  description:
    "Search and retrieve patient records filterable by [patient_id, user_id, first_name, last_name, national_id_number, or phone_number].",
  inputSchema: z.object({
    patient_id: z.string().optional(),
    user_id: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    national_id_number: z.string().optional(),
    phone_number: z.string().optional(),
  }),
  outputSchema: z.object({
    patients: z.array(
      z.object({
        patient_id: z.string().describe("unique identifier for the patient"),
        user_id: z.string().nullable().optional(),
        first_name: z.string().nullable().optional(),
        last_name: z.string().nullable().optional(),
        national_id_number: z.string().nullable().optional(),
        phone_number: z.string().nullable().optional(),
        date_of_birth: z.string().nullable().optional(),
        gender: z.string().nullable().optional(), // Using string instead of enum to be more robust
        address: z.string().nullable().optional(),
        blood_type: z.string().nullable().optional(),
        emergency_contact_name: z.string().nullable().optional(),
        emergency_contact_phone: z.string().nullable().optional(),
        insurance_provider: z.string().nullable().optional(),
        insurance_policy_number: z.string().nullable().optional(),
        users: z
          .object({ email: z.string().nullable().optional() })
          .nullable()
          .optional(),
      }),
    ),
  }),
});

export const getPatientsTool = (token: string) =>
  getPatientsToolDef.server(async (args) => {
    try {
      // Sanitize filters: remove undefined or empty values
      const rawFilters = args as Record<string, any>;
      const filters: patientFilterTypes = {};

      Object.keys(rawFilters).forEach((key) => {
        const val = rawFilters[key];
        if (val !== undefined && val !== null) {
          if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed.length > 0) {
              filters[key as keyof patientFilterTypes] = trimmed;
            }
          } else {
            filters[key as keyof patientFilterTypes] = val;
          }
        }
      });

      const { data, error } = await getPatients(token, filters);

      if (error) {
        console.error("[PatientTool] Controller Error:", error);
        throw new Error(
          `Failed to fetch patients: ${typeof error === "object" ? JSON.stringify(error) : error}`,
        );
      }

      if (!data) {
        return { patients: [] };
      }

      return {
        patients: data.map((patient: Patient) => ({
          patient_id: patient.patient_id,
          user_id: patient.user_id || null,
          first_name: patient.first_name || null,
          last_name: patient.last_name || null,
          national_id_number: patient.national_id_number || null,
          phone_number: patient.phone_number || null,
          date_of_birth: patient.date_of_birth || null,
          gender: patient.gender || null,
          address: patient.address || null,
          blood_type: patient.blood_type || null,
          emergency_contact_name: patient.emergency_contact_name || null,
          emergency_contact_phone: patient.emergency_contact_phone || null,
          insurance_provider: patient.insurance_provider || null,
          insurance_policy_number: patient.insurance_policy_number || null,
          users: patient.users ? { email: patient.users.email || null } : null,
        })),
      };
    } catch (err: any) {
      console.error("[PatientTool] Execution Error:", err);
      throw err;
    }
  });

import { PatientsService } from "../services/patientService.js";
import { getSupabaseClient } from "../config/supaDb.js";

// Types
import type {
  patientFilterTypes,
  PatientUpdate,
} from "../types/enums/patientTypes.js";

export const getPatients = async (
  token: string,
  filter: patientFilterTypes
) => {
  const { getPatientsService } = PatientsService;

  try {
    const supabase = getSupabaseClient(token);

    const { data, error } = await getPatientsService(supabase, filter);

    if (error) {
      throw error;
    }
    return { data };
  } catch (err: any) {
    console.error(`Fetching patients failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

export const updatePatient = async (token: string, body: PatientUpdate) => {
  const { updatePatientService } = PatientsService;

  try {
    const supabase = getSupabaseClient(token);

    // Extract patient_id and the rest of the data
    const { patient_id, ...updateData } = body;

    const { data, error } = await updatePatientService(
      supabase,
      patient_id,
      updateData
    );

    if (error) {
      console.error("Supabase Update Error Details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
    return { data };
  } catch (err: any) {
    console.error(`Updating patient failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

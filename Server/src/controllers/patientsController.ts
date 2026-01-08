import { PatientsService } from "../services/patientService.js";
import { getSupabaseClient } from "../config/supaDb.js";

// Types
import type { patientFilterTypes } from "../types/enums/patientTypes.js";

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

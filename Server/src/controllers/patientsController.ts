import { PatientsService } from "../services/patientService.js";
import { getSupabaseClient } from "../config/supaDb.js";

//Types
import type { patientFilterTypes } from "../types/enums/patientTypes.js";

export const getPatients = async (
  token: string,
  filter: patientFilterTypes
) => {
  const { getPateintsService } = PatientsService;

  try {
    const supabase = getSupabaseClient(token);

    const { data, error } = await getPateintsService(supabase, filter);

    if (error) {
      throw error;
    }
    return data;
  } catch (err: any) {
    console.error(`Fetching users failed: ${err?.message ?? err}`);
    return { error: err?.message ?? "Unknown error" };
  }
};

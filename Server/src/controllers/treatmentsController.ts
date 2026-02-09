import { getSupabaseClient } from "../config/supaDb.js";
import { TreatmentsService } from "../services/treatmentService.js";
import type { CreateTreatmentDTO } from "../types/enums/treatmentTypes.js";

export const createTreatment = async (
  token: string,
  body: CreateTreatmentDTO
) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await TreatmentsService.createTreatmentService(
      supabase,
      body
    );

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Creating treatment failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

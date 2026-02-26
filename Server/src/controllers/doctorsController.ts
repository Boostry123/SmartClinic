import { getSupabaseClient } from "../config/supaDb.js";
// Types
import type { doctorFilterTypes } from "../types/enums/doctorTypes.js";
import { DoctorsService } from "../services/doctorService.js";

export const getDoctors = async (token: string, filter: doctorFilterTypes) => {
  const { getDoctorsService } = DoctorsService;

  try {
    const supabase = getSupabaseClient(token);

    const { data, error } = await getDoctorsService(supabase, filter);

    if (error) {
      throw error;
    }
    return { data };
  } catch (err: any) {
    console.error(`Fetching patients failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

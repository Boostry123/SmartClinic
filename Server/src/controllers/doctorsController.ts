import { getSupabaseClient } from "../config/supaDb.js";
// Types
import type { doctorFilterTypes, DoctorUpdate } from "../types/enums/doctorTypes.js";
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
    console.error(`Fetching doctors failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

export const updateDoctor = async (token: string, body: DoctorUpdate) => {
  const { updateDoctorService } = DoctorsService;

  try {
    const supabase = getSupabaseClient(token);

    const results = await updateDoctorService(supabase, body);

    return { data: results };
  } catch (err: any) {
    console.error(`Updating doctor failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

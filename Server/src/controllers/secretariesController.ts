import { getSupabaseClient } from "../config/supaDb.js";
import { SecretariesService } from "../services/secretariesService.js";
//Types
import type { secretaryFilterTypes } from "../types/enums/secretary.js";

export const getSecretaries = async (
  token: string,
  filter: secretaryFilterTypes
) => {
  const { getSecretariesService } = SecretariesService;

  try {
    const supabase = getSupabaseClient(token);

    const { data, error } = await getSecretariesService(supabase, filter);

    if (error) {
      throw error;
    }
    return { data };
  } catch (err: any) {
    console.error(`Fetching secretaries failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

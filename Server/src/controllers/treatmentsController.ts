import { getSupabaseClient } from "../config/supaDb.js";
import { TreatmentsService } from "../services/treatmentService.js";
import { getUserDetails } from "../services/auth.js";
import { logInfo, logError } from "../utils/logger.js";
import LogAction from "../types/enums/logActions.js";
import type { CreateTreatmentDTO } from "../types/enums/treatmentTypes.js";
import { LogEntityType } from "../types/logs.js";

export const createTreatment = async (
  token: string,
  body: CreateTreatmentDTO,
) => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);
    const { data, error } = await TreatmentsService.createTreatmentService(
      supabase,
      body,
    );

    if (error) throw error;

    await logInfo({
      userId,
      action: LogAction.CREATE_TREATMENT,
      entityType: LogEntityType.TREATMENT,
      entityId: data?.id,
      metadata: { body },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Creating treatment failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.CREATE_TREATMENT_FAILED,
      entityType: LogEntityType.TREATMENT,
      metadata: {
        error: errorMessage,
        body,
      },
    });

    return { data: null, error: errorMessage };
  }
};

export const getTreatments = async (
  token: string,
  filter: Record<string, any>,
) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await TreatmentsService.getTreatmentsService(
      supabase,
      filter,
    );
    return { data, error };
  } catch (err: any) {
    console.error(`Getting treatments failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

import { getSupabaseClient } from "../config/supaDb.js";
import { SecretariesService } from "../services/secretariesService.js";
import { getUserDetails } from "../services/auth.js";
import { logInfo, logError } from "../utils/logger.js";
import LogAction from "../types/enums/logActions.js";
import { LogEntityType } from "../types/logs.js";
//Types
import type { secretaryFilterTypes } from "../types/enums/secretary.js";

export const getSecretaries = async (
  token: string,
  filter: secretaryFilterTypes,
) => {
  const { getSecretariesService } = SecretariesService;
  let userId = "unknown";

  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);

    const { data, error } = await getSecretariesService(supabase, filter);

    if (error) {
      throw error;
    }

    await logInfo({
      userId,
      action: LogAction.FETCH_SECRETARIES,
      entityType: LogEntityType.SECRETARY,
      metadata: { filter },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Fetching secretaries failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.FETCH_SECRETARIES_FAILED,
      entityType: LogEntityType.SECRETARY,
      metadata: { error: errorMessage, filter },
    });

    return { data: null, error: errorMessage };
  }
};

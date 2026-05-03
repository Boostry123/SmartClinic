import { getSupabaseClient } from "../config/supaDb.js";
import { getUserDetails } from "../services/auth.js";
import { logInfo, logError } from "../utils/logger.js";
import LogAction from "../types/enums/logActions.js";
// Types
import type {
  doctorFilterTypes,
  DoctorUpdate,
} from "../types/enums/doctorTypes.js";
import { LogEntityType } from "../types/logs.js";
import { DoctorsService } from "../services/doctorService.js";

export const getDoctors = async (token: string, filter: doctorFilterTypes) => {
  const { getDoctorsService } = DoctorsService;
  let userId = "unknown";

  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);

    const { data, error } = await getDoctorsService(supabase, filter);

    if (error) {
      throw error;
    }

    await logInfo({
      userId,
      action: LogAction.FETCH_DOCTORS,
      entityType: LogEntityType.DOCTOR,
      metadata: { filter },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Fetching doctors failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.FETCH_DOCTORS_FAILED,
      entityType: LogEntityType.DOCTOR,
      metadata: { error: errorMessage, filter },
    });

    return { data: null, error: errorMessage };
  }
};

export const updateDoctor = async (token: string, body: DoctorUpdate) => {
  const { updateDoctorService } = DoctorsService;
  let userId = "unknown";

  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);

    const results = await updateDoctorService(supabase, body);

    await logInfo({
      userId,
      action: LogAction.UPDATE_DOCTOR,
      entityType: LogEntityType.DOCTOR,
      entityId: body.id,
      metadata: { body },
    });

    return { data: results };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Updating doctor failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.UPDATE_DOCTOR_FAILED,
      entityType: LogEntityType.DOCTOR,
      entityId: body.id,
      metadata: {
        error: errorMessage,
        body,
      },
    });

    return { data: null, error: errorMessage };
  }
};

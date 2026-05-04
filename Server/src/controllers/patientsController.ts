import { PatientsService } from "../services/patientService.js";
import { getSupabaseClient } from "../config/supaDb.js";
import { getUserDetails } from "../services/auth.js";
import { logInfo, logError } from "../utils/logger.js";
import LogAction from "../types/enums/logActions.js";
import { LogEntityType } from "../types/logs.js";

// Types
import type {
  patientByIdsFilterTypes,
  patientFilterTypes,
  PatientUpdate,
} from "../types/enums/patientTypes.js";

export const getPatients = async (
  token: string,
  filter: patientFilterTypes,
) => {
  const { getPatientsService } = PatientsService;
  let userId = "unknown";

  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);

    const { data, error } = await getPatientsService(supabase, filter);

    if (error) {
      throw error;
    }

    await logInfo({
      userId,
      action: LogAction.FETCH_PATIENTS,
      entityType: LogEntityType.PATIENT,
      metadata: { filter },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Fetching patients failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.FETCH_PATIENTS_FAILED,
      entityType: LogEntityType.PATIENT,
      metadata: { error: errorMessage, filter },
    });

    return { data: null, error: errorMessage };
  }
};

export const getPatientsByIds = async (
  token: string,
  filter: patientByIdsFilterTypes,
) => {
  const { getPatientsByIdsService } = PatientsService;
  let userId = "unknown";

  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);

    const { data, error } = await getPatientsByIdsService(supabase, filter);

    if (error) {
      throw error;
    }

    await logInfo({
      userId,
      action: LogAction.FETCH_PATIENTS,
      entityType: LogEntityType.PATIENT,
      metadata: { filter },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Fetching patients by IDs failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.FETCH_PATIENTS_FAILED,
      entityType: LogEntityType.PATIENT,
      metadata: { error: errorMessage, filter },
    });

    return { data: null, error: errorMessage };
  }
};

export const updatePatient = async (token: string, body: PatientUpdate) => {
  const { updatePatientService } = PatientsService;
  let userId = "unknown";

  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);

    // Extract patient_id and the rest of the data
    const { patient_id, ...updateData } = body;

    const { data, error } = await updatePatientService(
      supabase,
      patient_id,
      updateData,
    );

    if (error) {
      throw error;
    }

    const updateDataKeys = Object.keys(updateData);
    await logInfo({
      userId,
      action: LogAction.UPDATE_PATIENT,
      entityType: LogEntityType.PATIENT,
      entityId: patient_id,
      metadata: { updateDataKeys },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Updating patient failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.UPDATE_PATIENT_FAILED,
      entityType: LogEntityType.PATIENT,
      entityId: body.patient_id,
      metadata: {
        error: errorMessage,
        body,
      },
    });

    return { data: null, error: errorMessage };
  }
};

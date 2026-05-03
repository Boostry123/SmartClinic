import { getSupabaseClient } from "../config/supaDb.js";
//Services
import { AppointmentsService } from "../services/appointment.js";
import { StorageService } from "../services/storage.js";
import { getUserDetails } from "../services/auth.js";
//Utils
import { logInfo, logError } from "../utils/logger.js";
//Types
import LogAction from "../types/enums/logActions.js";
import { LogEntityType } from "../types/logs.js";
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../types/enums/appointmentTypes.js";

export const createAppointment = async (
  token: string,
  body: CreateAppointmentDTO,
) => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);
    const { data, error } = await AppointmentsService.createAppointment(
      supabase,
      body,
    );

    if (error) throw error;

    await logInfo({
      userId,
      action: LogAction.CREATE_APPOINTMENT,
      entityType: LogEntityType.APPOINTMENT,
      entityId: data?.id,
      metadata: { body },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Creating appointment failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.CREATE_APPOINTMENT_FAILED,
      entityType: LogEntityType.APPOINTMENT,
      metadata: {
        error: errorMessage,
        body,
      },
    });

    return { data: null, error: errorMessage };
  }
};

/**
 * Orchestrates the appointment update by processing clinical images
 * and saving the final treatment data to the database.
 */
export const updateAppointment = async (
  token: string,
  body: any,
  files: any[],
): Promise<{ data: Appointment | null; error?: string }> => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const appointmentId = body.id;
    const supabase = getSupabaseClient(token);

    // 1. FETCH RAW DATA FOR CLEANUP
    const { data: appointments, error: fetchError } =
      await AppointmentsService.getAppointments(
        supabase,
        { id: appointmentId },
        true, // skipHydration = true to get real storage paths
      );

    if (fetchError) throw new Error(fetchError.message);

    const existingApp = appointments?.[0];
    if (!existingApp) {
      return {
        data: null,
        error: `Appointment with ID ${appointmentId} not found`,
      };
    }

    const patientId = existingApp.patient_id;
    const oldTreatmentData = existingApp?.treatment_data || {};
    const newTreatmentData = { ...oldTreatmentData };

    // 2. PROCESS FILES & DELETE OLD ONES
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (file.fieldname.startsWith("treatment_data.")) {
          const fieldKey = file.fieldname.split(".")[1];

          if (fieldKey) {
            const oldPath = oldTreatmentData[fieldKey];
            if (
              typeof oldPath === "string" &&
              oldPath.includes("/") &&
              !oldPath.startsWith("http")
            ) {
              await StorageService.deleteFile(
                supabase,
                "clinic-records",
                oldPath,
              );
            }

            const fileExt = file.originalname.split(".").pop() || "jpg";
            const filePath = `${patientId}/${appointmentId}/${fieldKey}_${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } =
              await StorageService.uploadClinicalImage(
                supabase,
                "clinic-records",
                filePath,
                file.buffer,
                file.mimetype,
              );

            if (uploadError) throw uploadError;
            newTreatmentData[fieldKey] = uploadData.path;
          }
        }
      }
    }

    // 3. UNFLATTEN TEXT FIELDS & DELETE REMOVED IMAGES
    for (const key of Object.keys(body)) {
      if (key.startsWith("treatment_data.")) {
        const actualKey = key.split(".")[1];
        if (actualKey) {
          let val = body[key];

          // Skip signed URLs
          if (typeof val === "string" && val.startsWith("http")) continue;

          // Handle explicit clearing of images
          if (val === "" && oldTreatmentData[actualKey]) {
            const oldPath = oldTreatmentData[actualKey];
            if (
              typeof oldPath === "string" &&
              oldPath.includes("/") &&
              !oldPath.startsWith("http")
            ) {
              await StorageService.deleteFile(
                supabase,
                "clinic-records",
                oldPath,
              ).catch(console.error);
            }
          }

          // Basic type restoration
          if (val === "true") val = true;
          if (val === "false") val = false;
          if (
            !isNaN(Number(val)) &&
            typeof val === "string" &&
            val.trim() !== ""
          )
            val = Number(val);

          newTreatmentData[actualKey] = val;
        }
      }
    }

    // 4. SANITIZE THE FINAL DTO
    const finalUpdateDto: Partial<UpdateAppointmentDTO> = {
      id: appointmentId,
      status: body.status,
      notes: body.notes,
      treatment_data: newTreatmentData,
      start_time: body.start_time,
      end_time: body.end_time,
      treatment_id: body.treatment_id,
      patient_id: body.patient_id,
    };

    Object.keys(finalUpdateDto).forEach((key) => {
      if ((finalUpdateDto as any)[key] === undefined) {
        delete (finalUpdateDto as any)[key];
      }
    });

    // 5. DATABASE UPDATE
    const { data: updatedRecord, error: updateError } =
      await AppointmentsService.updateAppointment(
        supabase,
        appointmentId,
        finalUpdateDto,
      );

    if (updateError) throw updateError;

    // 6. HYDRATE THE RESPONSE
    const { data: hydratedResults } = await AppointmentsService.getAppointments(
      supabase,
      { id: appointmentId },
    );

    await logInfo({
      userId,
      action: LogAction.UPDATE_APPOINTMENT,
      entityType: LogEntityType.APPOINTMENT,
      entityId: appointmentId,
      metadata: { body },
    });

    return { data: (hydratedResults?.[0] || updatedRecord) as Appointment };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    console.error(`[Controller Error]`, message);

    await logError({
      userId,
      action: LogAction.UPDATE_APPOINTMENT_FAILED,
      entityType: LogEntityType.APPOINTMENT,
      entityId: body.id,
      metadata: { error: message, body },
    });

    return { data: null, error: message };
  }
};

export const getAppointments = async (
  token: string,
  filters?: AppointmentFilters,
) => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);
    const { data, error } = await AppointmentsService.getAppointments(
      supabase,
      filters,
    );

    if (error) throw error;

    await logInfo({
      userId,
      action: LogAction.FETCH_APPOINTMENTS,
      entityType: LogEntityType.APPOINTMENT,
      metadata: { filters },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Fetching appointments failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.FETCH_APPOINTMENTS_FAILED,
      entityType: LogEntityType.APPOINTMENT,
      metadata: { error: errorMessage, filters },
    });

    return { data: null, error: errorMessage };
  }
};

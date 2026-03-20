import { getSupabaseClient } from "../config/supaDb.js";
//Services
import { AppointmentsService } from "../services/appointment.js";
import { StorageService } from "../services/storage.js";
//Types
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
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await AppointmentsService.createAppointment(
      supabase,
      body,
    );

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Creating appointment failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
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
  try {
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

    return { data: (hydratedResults?.[0] || updatedRecord) as Appointment };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    console.error(`[Controller Error]`, message);
    return { data: null, error: message };
  }
};

export const getAppointments = async (
  token: string,
  filters?: AppointmentFilters,
) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await AppointmentsService.getAppointments(
      supabase,
      filters,
    );

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Fetching appointments failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

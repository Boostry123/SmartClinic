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
  files: Express.Multer.File[],
): Promise<{ data: Appointment | null; error?: string }> => {
  try {
    const appointmentId = body.id;

    const supabase = getSupabaseClient(token);

    // 1. FETCH RAW DATA FOR CLEANUP
    // We use skipHydration = true because we need the real path, not a URL
    const { data: appointments } = await AppointmentsService.getAppointments(
      supabase,
      { id: appointmentId },
      true,
    );

    const existingApp = appointments?.[0];
    if (!existingApp) {
      return {
        data: null,
        error: `Appointment with ID ${appointmentId} not found`,
      };
    }

    const patientId = existingApp.patient_id;
    const oldTreatmentData = existingApp?.treatment_data || {};

    // Start with existing data, then we will overwrite specific keys
    const newTreatmentData = { ...oldTreatmentData };

    // 2. PROCESS FILES & DELETE OLD ONES
    for (const file of files) {
      if (file.fieldname.startsWith("treatment_data.")) {
        const fieldKey = file.fieldname.split(".")[1];

        if (fieldKey) {
          // --- THE DELETE LOGIC ---
          const oldPath = oldTreatmentData[fieldKey];
          // Ensure it's a string and looks like a Supabase path
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

          // --- THE UPLOAD LOGIC ---
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

    // 3. UNFLATTEN TEXT FIELDS & REMOVE JUNK
    // We create a clean object for the DB to avoid the 400 error
    Object.keys(body).forEach(async (key) => {
      if (key.startsWith("treatment_data.")) {
        const actualKey = key.split(".")[1];
        if (actualKey) {
          let val = body[key];

          // CRITICAL: If the frontend sends a signed URL, do NOT overwrite the storage path
          if (typeof val === "string" && val.startsWith("http")) {
            return;
          }

          // If the field was explicitly cleared (empty string), delete the old file if it exists
          if (val === "" && oldTreatmentData[actualKey]) {
            const oldPath = oldTreatmentData[actualKey];
            if (
              typeof oldPath === "string" &&
              oldPath.includes("/") &&
              !oldPath.startsWith("http")
            ) {
              // Note: This only runs if no NEW file was uploaded for this field in step 2,
              // because if it was a file, it wouldn't be in the text body.
              await StorageService.deleteFile(
                supabase,
                "clinic-records",
                oldPath,
              );
            }
          }

          // Basic type restoration for JSON
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
    });

    // 4. SANITIZE THE FINAL DTO (Prevents 400 Error)
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

    // Remove undefined values to avoid overwriting with null/undefined if not present
    Object.keys(finalUpdateDto).forEach((key) => {
      if ((finalUpdateDto as any)[key] === undefined) {
        delete (finalUpdateDto as any)[key];
      }
    });

    // 5. DATABASE UPDATE
    const { data, error } = await AppointmentsService.updateAppointment(
      supabase,
      appointmentId,
      finalUpdateDto,
    );

    if (error) throw error;
    return { data: data as Appointment };
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

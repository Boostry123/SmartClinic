// services/appointmentsService.ts
import { StorageService } from "./storage.js";
//types
import type {
  AppointmentFilters,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  Appointment,
} from "../types/enums/appointmentTypes.js";

export const AppointmentsService = {
  /**
   * Creates a new appointment record
   */
  createAppointment: (client: any, data: CreateAppointmentDTO) => {
    return client.from("appointments").insert(data).select().single();
  },

  /**
   * Fetches appointments based on filters.
   * Handles "Hydration" (converting storage paths into viewable Signed URLs).
   */
  getAppointments: async (
    client: any,
    filters?: AppointmentFilters,
    skipHydration: boolean = false,
  ) => {
    // 1. Define relationship joins (to keep the main query clean)
    const relations = `
      patients ( first_name, last_name ),
      doctors ( 
          specialization,
          users ( name, last_name, email )
      )
    `;

    // 2. Define fields to select
    const fields = filters?.excludeTreatmentData
      ? `id, patient_id, doctor_id, treatment_id, start_time, end_time, status, notes, created_at, ${relations}`
      : `*, ${relations}`;

    // 3. Initialize query
    let query = client.from("appointments").select(fields);

    // 4. Apply Equality Filters
    if (filters?.id) query = query.eq("id", filters.id);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.patient_id) query = query.eq("patient_id", filters.patient_id);
    if (filters?.doctor_id) query = query.eq("doctor_id", filters.doctor_id);

    // 5. Apply Date Range Filters (Time Query)
    if (filters?.start_time)
      query = query.gte("start_time", filters.start_time);
    if (filters?.end_time) query = query.lte("start_time", filters.end_time);

    // 6. Execute the query
    const { data: appointments, error } = await query.order("start_time", {
      ascending: true,
    });

    // Handle DB errors or cases where we explicitly don't want to sign URLs
    if (
      error ||
      !appointments ||
      skipHydration ||
      filters?.excludeTreatmentData
    ) {
      return { data: appointments, error };
    }

    // 7. HYDRATION: Convert paths to Signed URLs for the Frontend
    const hydratedAppointments = await Promise.all(
      appointments.map(async (app: Appointment) => {
        // Create a shallow copy of treatment_data to avoid mutating the original reference
        const hydratedTreatment = { ...app.treatment_data };

        for (const [key, value] of Object.entries(hydratedTreatment)) {
          // Check if the value is a storage path (string containing a slash and NOT an absolute URL)
          if (
            typeof value === "string" &&
            value.includes("/") &&
            !value.startsWith("http")
          ) {
            try {
              const { data: signedData } =
                await StorageService.generateSignedUrl(
                  client,
                  "clinic-records",
                  value,
                );

              if (signedData?.signedUrl) {
                hydratedTreatment[key] = signedData.signedUrl;
              }
            } catch (err) {
              console.error(
                `[Hydration Error] Failed to sign URL for key: ${key}`,
                err,
              );
            }
          }
        }

        return { ...app, treatment_data: hydratedTreatment };
      }),
    );

    return { data: hydratedAppointments, error: null };
  },

  /**
   * Updates an existing appointment
   * Sanitizes the payload to prevent 400 errors from Supabase
   */
  updateAppointment: (
    client: any,
    id: string,
    data: Partial<UpdateAppointmentDTO>,
  ) => {
    // We strip out 'id' from the update payload.
    // Supabase throws a 400 error if you try to "update" the primary key.
    const { id: _, ...updatePayload } = data;

    return client
      .from("appointments")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();
  },
};

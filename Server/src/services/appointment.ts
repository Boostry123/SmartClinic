//Types
import type {
  AppointmentFilters,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../types/enums/appointmentTypes.js";

export const AppointmentsService = {
  createAppointment: (client: any, data: CreateAppointmentDTO) => {
    return client.from("appointments").insert(data).select().single();
  },

  getAppointments: (client: any, filters?: AppointmentFilters) => {
    let query = client.from("appointments").select(`
        *,
        patients ( first_name, last_name ),
        doctors ( specialization )
      `);
    if (filters?.id) {
      query = query.eq("id", filters.id);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.patient_id) {
      query = query.eq("patient_id", filters.patient_id);
    }

    if (filters?.doctor_id) {
      query = query.eq("doctor_id", filters.doctor_id);
    }

    // Date range filtering (e.g., "Show me appointments for today")
    if (filters?.start_time) {
      query = query.gte("start_time", filters.start_time);
    }
    if (filters?.end_time) {
      query = query.lte("end_time", filters.end_time);
    }

    return query.order("start_time", { ascending: true });
  },

  updateAppointment: (client: any, id: string, data: UpdateAppointmentDTO) => {
    return client
      .from("appointments")
      .update(data)
      .eq("id", id)
      .select()
      .single();
  },
};

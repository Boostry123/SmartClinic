import { getSupabaseClient } from "../config/supaDb.js";
//Services
import { AppointmentsService } from "../services/appointment.js";
//Types
import type {
  AppointmentFilters,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../types/enums/appointmentTypes.js";

export const createAppointment = async (
  token: string,
  body: CreateAppointmentDTO
) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await AppointmentsService.createAppointment(
      supabase,
      body
    );

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Creating appointment failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

export const updateAppointment = async (
  token: string,
  body: UpdateAppointmentDTO
) => {
  try {
    const supabase = getSupabaseClient(token);

    const { data, error } = await AppointmentsService.updateAppointment(
      supabase,
      body.id,
      body
    );

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Updating appointment failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};
export const getAppointments = async (
  token: string,
  filters?: AppointmentFilters
) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await AppointmentsService.getAppointments(
      supabase,
      filters
    );

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Fetching appointments failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

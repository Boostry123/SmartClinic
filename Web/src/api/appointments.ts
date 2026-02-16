import apiClient from "./axiosClient";
import { useAuthStore } from "../store/authStore";
import type {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentFilters,
} from "./types/appointments";

export const createAppointment = async (
  appointmentData: CreateAppointmentDTO
): Promise<Appointment> => {
  const { user } = useAuthStore.getState();
  const allowedRoles = ["admin", "doctor", "secretary"];

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    throw new Error(
      "Unauthorized: You do not have permission to create appointments."
    );
  }

  const response = await apiClient.post<Appointment>(
    "/appointments",
    appointmentData
  );
  return response.data;
};

export const updateAppointment = async (
  appointmentData: UpdateAppointmentDTO
): Promise<Appointment> => {
  const response = await apiClient.patch<Appointment>(
    "/appointments",
    appointmentData
  );
  return response.data;
};

export const getAppointments = async (
  filters?: AppointmentFilters
): Promise<Appointment[]> => {
  const response = await apiClient.get<Appointment[]>("/appointments", {
    params: filters,
  });
  return response.data;
};

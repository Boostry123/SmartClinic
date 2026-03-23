import apiClient from "./axiosClient";
import { useAuthStore } from "../store/authStore";
import type {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentFilters,
} from "./types/appointments";

export const createAppointment = async (
  appointmentData: CreateAppointmentDTO,
): Promise<Appointment> => {
  const { user } = useAuthStore.getState();
  const allowedRoles = ["admin", "doctor", "secretary"];

  if (
    !user ||
    !user.user_metadata.role ||
    !allowedRoles.includes(user.user_metadata.role)
  ) {
    throw new Error(
      "Unauthorized: You do not have permission to create appointments.",
    );
  }

  const response = await apiClient.post<Appointment>(
    "/appointments",
    appointmentData,
  );
  return response.data;
};

export const updateAppointment = async (
  appointmentData: UpdateAppointmentDTO,
): Promise<Appointment> => {
  const { user } = useAuthStore.getState();
  const allowedRoles = ["admin", "doctor"];

  if (
    !user ||
    !user.user_metadata.role ||
    !allowedRoles.includes(user.user_metadata.role)
  ) {
    throw new Error(
      "Unauthorized: You do not have permission to update appointments.",
    );
  }

  // 1. Create a FormData instance
  const formData = new FormData();

  // 2. Append top-level fields
  formData.append("id", appointmentData.id);
  if (appointmentData.status) formData.append("status", appointmentData.status);
  if (appointmentData.notes) formData.append("notes", appointmentData.notes);
  // ... add other top-level fields if needed

  // 3. Process the treatment_data JSON
  if (appointmentData.treatment_data) {
    Object.entries(appointmentData.treatment_data).forEach(([key, value]) => {
      if (value instanceof File) {
        // Appending a binary file
        formData.append(`treatment_data.${key}`, value);
      } else if (typeof value === "string" && value.startsWith("http")) {
        // SKIP signed URLs: The backend will keep the existing storage path
        // if we don't send a new file or a different string for this key.
        return;
      } else if (value === null) {
        // Explicitly send an empty string to signal deletion
        formData.append(`treatment_data.${key}`, "");
      } else if (value !== undefined) {
        // Appending strings, numbers, or booleans
        formData.append(`treatment_data.${key}`, String(value));
      }
    });
  }

  // 4. Send the PATCH request with FormData
  const response = await apiClient.patch<Appointment>(
    "/appointments",
    formData,
  );

  return response.data;
};

export const getAppointments = async (
  filters?: AppointmentFilters,
): Promise<Appointment[]> => {
  const response = await apiClient.get<Appointment[]>("/appointments", {
    params: filters,
  });
  return response.data;
};

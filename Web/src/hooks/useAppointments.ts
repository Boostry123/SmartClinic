import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../api/appointments";
//Types
import type {
  Appointment,
  AppointmentFilters,
} from "../api/types/appointments";

const useAppointments = (filters: AppointmentFilters) => {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", filters],
    queryFn: () => getAppointments(filters),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useAppointmentsForDoctor = (filters: AppointmentFilters) => {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", filters],
    queryFn: () => getAppointments(filters),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: (previousData) => previousData,
    enabled: !!filters.doctor_id,
  });
};

export default useAppointments;

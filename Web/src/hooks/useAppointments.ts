import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useAppointmentsForDoctor = (filters: AppointmentFilters) => {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", filters],
    queryFn: () => getAppointments(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData,
    enabled: !!filters.doctor_id,
  });
};

export const useInvalidateAppointments = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
    [queryClient]
  );
};

export default useAppointments;

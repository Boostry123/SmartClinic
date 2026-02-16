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
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData,
  });
};

export default useAppointments;

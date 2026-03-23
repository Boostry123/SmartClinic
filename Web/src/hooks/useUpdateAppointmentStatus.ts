import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointment } from "../api/appointments";
import { type AppointmentStatus } from "../api/types/appointments";

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      updateAppointment({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

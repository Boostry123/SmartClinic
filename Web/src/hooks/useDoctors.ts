import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//DEVELOPED
import { getDoctors, updateDoctor } from "../api/doctors";
//TYPES
import type { Doctor, doctorFilterTypes, DoctorUpdate } from "../api/types/doctors";

const useDoctors = (filters: doctorFilterTypes) => {
  // useQuery handles the loading, error, and data states for you
  return useQuery<Doctor[], Error>({
    // queryKey: This is the unique identifier for the cache.
    // Whenever 'filters' changes, TanStack Query refetches automatically.
    queryKey: ["doctors", filters],

    // queryFn: The actual function that fetches the data.
    queryFn: () => getDoctors(filters),
    // This specific query will now stay "fresh" for 60 minutes
    staleTime: 1000 * 60 * 60,
    // Data remains in cache for 60 mins after component unmounts
    gcTime: 1000 * 60 * 60,
    enabled: !!filters, // Only run the query if filters are provided
    // Optional: Keep previous data while fetching new data (great for filters)
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DoctorUpdate) => updateDoctor(data),
    onSuccess: () => {
      // Invalidate the doctors query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export default useDoctors;

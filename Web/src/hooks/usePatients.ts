import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//DEVELOPED
import { getPatients, getPatientsByIds, updatePatient } from "../api/patients";
//TYPES
import type {
  Patient,
  patientByIdsFilterTypes,
  patientFilterTypes,
  PatientUpdate,
} from "../api/types/patients";

const usePatients = (filters: patientFilterTypes) => {
  // useQuery handles the loading, error, and data states for you
  return useQuery<Patient[], Error>({
    // queryKey: This is the unique identifier for the cache.
    // Whenever 'filters' changes, TanStack Query refetches automatically.
    queryKey: ["patients", filters],

    // queryFn: The actual function that fetches the data.
    queryFn: () => getPatients(filters),
    // This specific query will now stay "fresh" for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Data remains in cache for 10 mins after component unmounts
    gcTime: 1000 * 60 * 10,

    // Optional: Keep previous data while fetching new data (great for filters)
    placeholderData: (previousData) => previousData,
  });
};
export const usePatientsByIds = (filters: patientByIdsFilterTypes) => {
  // useQuery handles the loading, error, and data states for you
  return useQuery<Patient[], Error>({
    // queryKey: This is the unique identifier for the cache.
    // Whenever 'filters' changes, TanStack Query refetches automatically.
    queryKey: ["patients", filters],

    // queryFn: The actual function that fetches the data.
    queryFn: () => getPatientsByIds(filters),
    // This specific query will now stay "fresh" for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Data remains in cache for 10 mins after component unmounts
    gcTime: 1000 * 60 * 10,
    enabled: !!filters.patient_id && filters.patient_id.length > 0,

    // Optional: Keep previous data while fetching new data (great for filters)
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatientUpdate) => updatePatient(data),
    onSuccess: () => {
      // Invalidate the patients query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

export default usePatients;

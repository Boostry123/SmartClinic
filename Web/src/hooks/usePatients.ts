import { useQuery, useMutation } from "@tanstack/react-query";
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
    staleTime: Infinity,
    // Data remains in cache for 30 mins after component unmounts
    gcTime: 1000 * 60 * 30,

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
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    enabled: !!filters.patient_id && filters.patient_id.length > 0,

    // Optional: Keep previous data while fetching new data (great for filters)
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdatePatient = () => {
  return useMutation({
    mutationFn: (data: PatientUpdate) => updatePatient(data),
  });
};

export default usePatients;

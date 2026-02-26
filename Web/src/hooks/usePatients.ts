import { useQuery } from "@tanstack/react-query";
//DEVELOPED
import { getPatients } from "../api/patients";
//TYPES
import type { Patient, patientFilterTypes } from "../api/types/patients";

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

export default usePatients;

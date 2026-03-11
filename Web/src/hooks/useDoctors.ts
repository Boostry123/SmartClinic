import { useQuery } from "@tanstack/react-query";
//DEVELOPED
import { getDoctors } from "../api/doctors";
//TYPES
import type { Doctor, doctorFilterTypes } from "../api/types/doctors";

const useDoctors = (filters: doctorFilterTypes) => {
  // useQuery handles the loading, error, and data states for you
  return useQuery<Doctor[], Error>({
    // queryKey: This is the unique identifier for the cache.
    // Whenever 'filters' changes, TanStack Query refetches automatically.
    queryKey: ["doctors", filters],

    // queryFn: The actual function that fetches the data.
    queryFn: () => getDoctors(filters),
    // This specific query will now stay "fresh" for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Data remains in cache for 10 mins after component unmounts
    gcTime: 1000 * 60 * 10,

    // Optional: Keep previous data while fetching new data (great for filters)
    placeholderData: (previousData) => previousData,
  });
};

export default useDoctors;

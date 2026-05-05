import { useQuery } from "@tanstack/react-query";
import { getTreatments } from "../api/treatments";
//Types
import type { filterTreatment, Treatment } from "../api/types/treatments";

const useTreatments = (filter?: filterTreatment, enabled?: boolean) => {
  return useQuery<Treatment[], Error>({
    queryKey: filter ? ["treatments", filter] : ["treatments"],
    queryFn: () => getTreatments(filter),
    staleTime: Infinity, // 5 minutes
    gcTime: 1000 * 60 * 30, // 10 minutes
    enabled: enabled,
  });
};

export default useTreatments;

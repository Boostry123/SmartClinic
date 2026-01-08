import { useEffect, useState } from "react";
import { getPatients, type Patient } from "../api/getPatients";
// --- Types ---
export interface PatientFilters {
  patient_id?: string;
  user_id?: string;
  national_id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

const usePatients = (filters: PatientFilters) => {
  const [data, setData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevents updating state if component unmounts

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getPatients(filters);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError("Failed to load:");
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return { data, isLoading, error };
};

export default usePatients;

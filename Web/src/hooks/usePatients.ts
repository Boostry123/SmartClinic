import { useEffect, useState } from "react";
//DEVELOPED
import { getPatients } from "../api/getPatients";
//TYPES
import type { Patient, patientFilterTypes } from "../api/types/patients";

const usePatients = (filters: patientFilterTypes) => {
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

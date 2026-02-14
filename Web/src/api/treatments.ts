import apiClient from "./axiosClient";
import type { Treatment, CreateTreatmentDTO } from "./types/treatments";

export const createTreatment = async (
  treatmentData: CreateTreatmentDTO
): Promise<Treatment> => {
  const response = await apiClient.post<Treatment>(
    "/treatments",
    treatmentData
  );
  return response.data;
};

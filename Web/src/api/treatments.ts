import apiClient from "./axiosClient";
//Types
import type {
  Treatment,
  filterTreatment,
  CreateTreatmentDTO,
} from "./types/treatments";

export const getTreatments = async (
  filter?: filterTreatment
): Promise<Treatment[]> => {
  try {
    const res = await apiClient.get<Treatment[]>(`treatments`, {
      params: filter,
    });
    console.log("getTreatments success:", res.data.length, "items found");
    return res.data;
  } catch (err) {
    console.error("getTreatments error:", err);
    throw err;
  }
};
export const createTreatment = async (
  treatmentData: CreateTreatmentDTO
): Promise<Treatment> => {
  const response = await apiClient.post<Treatment>(
    "/treatments",
    treatmentData
  );
  return response.data;
};

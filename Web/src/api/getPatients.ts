import apiClient from "./axiosClient";
import type { Patient, patientFilterTypes } from "./types/patients";

//this function fetches all users with a role of 'patient' from the backend API
export const getPatients = async (
  filter?: patientFilterTypes,
): Promise<Patient[]> => {
  try {
    const res = await apiClient.get<Patient[]>(`patients`, {
      params: filter,
    });
    console.log("getPatients success:", res.data.length, "items found");
    return res.data;
  } catch (err) {
    console.error("getPatients error:", err);
    throw err;
  }
};

import apiClient from "./axiosClient";
import type { Doctor, doctorFilterTypes } from "./types/doctors";

//this function fetches all users with a role of 'patient' from the backend API
export const getDoctors = async (
  filter?: doctorFilterTypes,
): Promise<Doctor[]> => {
  try {
    const res = await apiClient.get<Doctor[]>(`doctors`, {
      params: filter,
    });
    console.log("getPatients success:", res.data.length, "items found");
    return res.data;
  } catch (err) {
    console.error("getPatients error:", err);
    throw err;
  }
};

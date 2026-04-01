import apiClient from "./axiosClient";
import type { Doctor, doctorFilterTypes, DoctorUpdate } from "./types/doctors";

//this function fetches all users with a role of 'patient' from the backend API
export const getDoctors = async (
  filter?: doctorFilterTypes,
): Promise<Doctor[]> => {
  try {
    const res = await apiClient.get<Doctor[]>(`doctors`, {
      params: filter,
    });
    console.log("getDoctors success:", res.data.length, "items found");
    return res.data;
  } catch (err) {
    console.error("getDoctors error:", err);
    throw err;
  }
};

export const updateDoctor = async (
  data: DoctorUpdate,
): Promise<Doctor> => {
  try {
    const res = await apiClient.patch<Doctor>(`doctors`, data);
    console.log("updateDoctor success");
    return res.data;
  } catch (err) {
    console.error("updateDoctor error:", err);
    throw err;
  }
};

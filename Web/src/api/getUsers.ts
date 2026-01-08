import apiClient from "./axiosClient";

export interface User {
  id: string;
  created_at: string;
  name: string;
  role: string;
}

//this function fetches all users with a role of 'patient' from the backend API
export const getUsers = async (): Promise<User[]> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL;
    const res = await apiClient.get<User[]>(`${baseUrl}/users`, {
      params: { role: "patient" },
    });
    if (res) {
      console.log("getPatients response data:", res.data);
    }
    return res.data;
  } catch (err) {
    console.error("getPatients error:", err);
    throw err;
  }
};

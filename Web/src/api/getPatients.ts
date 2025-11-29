import axios from "axios";

export interface Patient {
  id: string;
  created_at: string;
  name: string;
  role: string;
}

//this function fetches all users with a role of 'patient' from the backend API
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL;
    const res = await axios.get<Patient[]>(`${baseUrl}/users/patient`);
    return res.data;
  } catch (err) {
    console.error("getPatients error:", err);
    throw err;
  }
};

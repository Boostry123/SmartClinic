import apiClient from "./axiosClient";

export interface Patient {
  patient_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  national_id: string;
  phone_number: string;
  users?: { email?: string };
  address: string;
  blood_type: string;
  emergency_contact: string;
  emergency_contact_phone: string;
  insurance_provider: string;
  insurance_policy_number: string;
}

export interface patientFilterTypes {
  patient_id?: string;
  user_id?: string;
  national_id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

//this function fetches all users with a role of 'patient' from the backend API
export const getPatients = async (
  filter?: patientFilterTypes
): Promise<Patient[]> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL;
    const res = await apiClient.get<Patient[]>(`${baseUrl}/patients`, {
      params: filter,
    });
    console.log("getPatients success:", res.data.length, "items found");
    return res.data;
  } catch (err) {
    console.error("getPatients error:", err);
    throw err;
  }
};

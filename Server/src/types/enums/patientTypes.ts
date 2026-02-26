export type Gender = "male" | "female" | "other";

export interface Patient {
  patient_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  national_id_number: string;
  phone_number: string;
  users?: { email?: string };
  address: string;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  insurance_provider: string;
  insurance_policy_number: string;
}

export interface PatientUpdate {
  patient_id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: Gender;
  national_id_number?: string;
  phone_number?: string;
  address?: string;
  blood_type?: string;
  emergency_contact?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
}

export interface patientFilterTypes {
  patient_id?: string;
  user_id?: string;
  national_id_number?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

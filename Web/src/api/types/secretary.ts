export interface Secretary {
  secretary_id: string;
  user_id: string;
  doctor_id: string;
  user?: { email: string; name: string; last_name: string };
  phone_number: string;
  status: string;
  created_at: string;
  national_id_number: string;
}
export interface secretaryFilterTypes {
  secretary_id?: string;
  user_id?: string;
  doctor_id?: string;
  national_id_number?: string;
  phone_number?: string;
  status?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: "admin" | "doctor" | "patient" | "secretary";
  name: string;
  last_name: string;
  national_id_number: string;
  doctor_id?: string; // Only required for secretaries, optional for others
}

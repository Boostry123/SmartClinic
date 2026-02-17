export type ClinicRole = "admin" | "doctor" | "patient" | "secretary";

export interface UserProfile {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    last_name: string;
    role: ClinicRole;
    national_id_number: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export const ClinicRoleEnum = {
  admin: "admin",
  doctor: "doctor",
  patient: "patient",
  secretary: "secretary",
} as const;

// This automatically creates: "admin" | "doctor" | "patient" | "secretary"
export type ClinicRole = (typeof ClinicRoleEnum)[keyof typeof ClinicRoleEnum];

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

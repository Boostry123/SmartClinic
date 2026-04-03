export interface Doctor {
  user_id: string;
  id: string;
  national_id_number: string;
  specialization: string;
  license_number: string;
  career_start_date: string;
  bio: string;
  created_at: string;
  users: {
    name: string;
    last_name: string;
    email: string;
    role: string;
  };
}
export interface DoctorUpdate {
  id: string;
  user_id: string;
  national_id_number?: string;
  specialization?: string;
  license_number?: string;
  bio?: string;
  career_start_date?: string;
  users?: {
    name?: string;
    last_name?: string;
  };
}

export interface doctorFilterTypes {
  id?: string;
  user_id?: string;
  national_id_number?: string;
}

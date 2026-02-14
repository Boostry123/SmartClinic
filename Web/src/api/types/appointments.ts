export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "confirmed"
  | "checked_in";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  treatment_id: string;
  treatment_data: Record<string, unknown>;
  start_time: string; // ISO string
  end_time: string; // ISO string
  status: AppointmentStatus;
  notes: string;
  created_at: string;
  patients?: {
    first_name: string;
    last_name: string;
  };
  doctors?: {
    specialization: string;
  };
}

export interface CreateAppointmentDTO {
  patient_id: string;
  doctor_id: string;
  start_time: string; // ISO 8601
  end_time?: string; // ISO 8601
  status?: AppointmentStatus;
  notes?: string;
}

export interface UpdateAppointmentDTO {
  id: string;
  patient_id?: string;
  doctor_id?: string;
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface AppointmentFilters {
  id?: string;
  status?: AppointmentStatus;
  patient_id?: string;
  doctor_id?: string;
  start_time?: string;
  end_time?: string;
}

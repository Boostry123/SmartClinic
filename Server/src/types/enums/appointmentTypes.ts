export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  treatment_id: string;
  treatment_data: Record<string, any>;
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
    users: {
      name: string;
      last_name: string;
      email: string;
    };
  };
}

export type CreateAppointmentDTO = Omit<
  Appointment,
  "id" | "created_at" | "status" | "notes"
> & {
  status?: AppointmentStatus;
  notes?: string;
};

export type UpdateAppointmentDTO = { id: string } & Partial<
  Pick<
    Appointment,
    | "patient_id"
    | "doctor_id"
    | "treatment_id"
    | "treatment_data"
    | "start_time"
    | "end_time"
    | "status"
    | "notes"
  >
>;
export interface AppointmentFilters {
  id?: string; // Specific appointment ID
  status?: AppointmentStatus;
  patient_id?: string;
  doctor_id?: string;
  start_time?: string; // ISO String
  end_time?: string; // ISO String
}

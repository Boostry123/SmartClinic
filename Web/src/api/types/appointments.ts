export const AppointmentStatusEnum = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
} as const satisfies Record<string, AppointmentStatus>;
export const statusStyles: Record<string, string> = {
  [AppointmentStatusEnum.SCHEDULED]:
    "px-4 py-2 rounded-md border border-blue-200 bg-blue-50 text-blue-700 border-blue-200",
  [AppointmentStatusEnum.COMPLETED]:
    "px-4 py-2 rounded-md border bg-green-50 text-green-700 border-green-200",
  [AppointmentStatusEnum.CANCELLED]:
    " px-4 py-2 rounded-md border bg-red-50 text-red-700 border-red-200",
  [AppointmentStatusEnum.CONFIRMED]:
    "px-4 py-2 rounded-md border bg-purple-50 text-purple-700 border-purple-200",
  [AppointmentStatusEnum.CHECKED_IN]:
    "px-4 py-2 rounded-md border bg-orange-100 text-orange-800 border-orange-300",
};
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
  treatment_data: Record<string, "string | number | boolean">;
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

export interface CreateAppointmentDTO {
  patient_id: string;
  doctor_id: string;
  start_time: string; // ISO 8601
  end_time?: string; // ISO 8601
  status?: AppointmentStatus;
  notes?: string;
  treatment_id: string;
  treatment_data: Record<string, string | number | boolean>;
}

export interface UpdateAppointmentDTO {
  id: string;
  patient_id?: string;
  doctor_id?: string;
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatus;
  notes?: string;
  treatment_id?: string;
  treatment_data?: Record<string, unknown>;
}

export interface AppointmentFilters {
  id?: string;
  status?: AppointmentStatus;
  patient_id?: string;
  doctor_id?: string;
  start_time?: string;
  end_time?: string;
}

import LogAction from "./enums/logActions.js";

export enum LogSeverity {
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  DEBUG = "debug",
}

export enum LogEntityType {
  USER = "user",
  DOCTOR = "doctor",
  APPOINTMENT = "appointment",
  PATIENT = "patient",
  TREATMENT = "treatment",
  DOCUMENT = "document",
  SECRETARY = "secretary",
}

export interface ActionLog {
  id?: string;
  user_id: string;
  action: LogAction;
  entity_type: LogEntityType;
  entity_id?: string;
  severity: LogSeverity;
  metadata?: Record<string, any>;
  request_context?: Record<string, any> | null;
  created_at?: string | Date;
}

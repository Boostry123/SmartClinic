export interface Field {
  id: string;
  label: string;
  type: "number" | "textarea" | "select" | "checkbox" | "text";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string | boolean;
}

export interface Treatment {
  id: string;
  treatment_name: string;
  estimated_time: number;
  template: {
    version: string;
    fields: Field[];
  };
}

export interface CreateTreatmentDTO {
  treatment_name: string;
  estimated_time: number; // in minutes
  template: {
    version: string;
    fields: Field[];
  };
}

export interface filterTreatment {
  treatment_name?: string;
  estimated_time?: number;
  created_by?: string;
  id?: string;
}

export type FormValues = Record<string, string | number | boolean>;

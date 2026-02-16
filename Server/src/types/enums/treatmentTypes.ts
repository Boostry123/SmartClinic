export interface Treatment {
  id: string;
  treatment_name: string | null;
  estimated_time: number | null;
  created_at: string;
  created_by: string;
  template: Record<string, any> | null;
}

export interface filterTreatment {
  treatment_name?: string;
  estimated_time?: number;
  created_by?: string;
  id?: string;
}

// Data required for creation (id, created_at, created_by are handled by DB)
export type CreateTreatmentDTO = Pick<
  Treatment,
  "treatment_name" | "estimated_time" | "template"
>;

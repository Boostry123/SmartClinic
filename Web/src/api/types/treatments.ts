export interface Treatment {
  id: string;
  treatment_name: string;
  estimated_time: number;
  template: object;
}

export interface CreateTreatmentDTO {
  treatment_name: string;
  estimated_time: number; // in minutes
  template: object;
}

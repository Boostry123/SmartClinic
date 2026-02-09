import type { CreateTreatmentDTO } from "../types/enums/treatmentTypes.js";

export const TreatmentsService = {
  createTreatmentService: (client: any, treatmentData: CreateTreatmentDTO) => {
    return client.from("treatments").insert(treatmentData).select().single();
  },

  getTreatmentsService: (client: any) => {
    return client.from("treatments").select("*");
  },
};

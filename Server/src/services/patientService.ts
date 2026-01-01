import type { patientFilterTypes } from "../types/enums/patientTypes.js";

export const PatientsService = {
  // Accepts filter as a parameter to query patients based on different fields
  getPateintsService: (client: any, filter: patientFilterTypes) => {
    return client.from("patients").select("*").match(filter);
  },
};

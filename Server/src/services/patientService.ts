import type {
  patientByIdsFilterTypes,
  patientFilterTypes,
  PatientUpdate,
} from "../types/enums/patientTypes.js";

export const PatientsService = {
  // Accepts filter as a parameter to query patients based on different fields
  // Joins with 'users' table to get more details like email
  getPatientsService: (client: any, filter: patientFilterTypes) => {
    return client
      .from("patients")
      .select(
        `
      *,
      users (
        email
      )
    `,
      )
      .match(filter);
  },

  getPatientsByIdsService: (client: any, filter: patientByIdsFilterTypes) => {
    return client
      .from("patients")
      .select(
        `
      *,
      users (
        email
      )
    `,
      )
      .in("patient_id", filter.patient_id || []);
  },

  updatePatientService: (
    client: any,
    patient_id: string,
    data: Partial<PatientUpdate>,
  ) => {
    return client
      .from("patients")
      .update(data)
      .eq("patient_id", patient_id)
      .select()
      .single();
  },
};

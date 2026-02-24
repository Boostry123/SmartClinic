import type { patientFilterTypes } from "../types/enums/patientTypes.js";

export const DoctorsService = {
  // Accepts filter as a parameter to query patients based on different fields
  // Joins with 'users' table to get more details like email
  getDoctorsService: (client: any, filter: patientFilterTypes) => {
    return client
      .from("doctors")
      .select(
        `
      *,
      users (
        email,
        name,
        last_name,
        role
      )
    `,
      )
      .match(filter);
  },
};

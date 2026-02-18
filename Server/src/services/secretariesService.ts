import type { secretaryFilterTypes } from "../types/enums/secretary.js";

export const SecretariesService = {
  // Accepts filter as a parameter to query secretaries based on different fields
  // Joins with 'users' table to get more details like email
  getSecretariesService: (client: any, filter: secretaryFilterTypes) => {
    return client
      .from("secretaries")
      .select(
        `
      *,
      users (
        name,
        last_name,
        email
      )
    `
      )
      .match(filter);
  },
};

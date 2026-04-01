import type {
  doctorFilterTypes,
  DoctorUpdate,
} from "../types/enums/doctorTypes.js";

export const DoctorsService = {
  getDoctorsService: (client: any, filter: doctorFilterTypes) => {
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

  // The Update Service
  updateDoctorService: async (
    client: any,
    updates: DoctorUpdate,
  ) => {
    const { id: doctorId, user_id: userId, users, ...rawDoctorFields } = updates;

    const updatePromises: Promise<any>[] = [];

    // Sanitize doctorFields: convert empty strings to null and remove undefined
    const doctorFields: Record<string, any> = {};
    for (const [key, value] of Object.entries(rawDoctorFields)) {
      if (value === undefined) continue;
      
      // Convert empty strings to null (especially important for date fields)
      if (typeof value === "string" && value.trim() === "") {
        doctorFields[key] = null;
      } else {
        doctorFields[key] = value;
      }
    }

    // 1. Update doctors table if there are doctorFields
    if (Object.keys(doctorFields).length > 0) {
      updatePromises.push(
        client.from("doctors").update(doctorFields).eq("id", doctorId)
      );
    }

    // 2. Update users table if there are userFields
    if (users && Object.keys(users).length > 0) {
      const sanitizedUsers: Record<string, any> = {};
      for (const [key, value] of Object.entries(users)) {
        if (value === undefined) continue;
        if (typeof value === "string" && value.trim() === "") {
          sanitizedUsers[key] = null;
        } else {
          sanitizedUsers[key] = value;
        }
      }

      if (Object.keys(sanitizedUsers).length > 0) {
        updatePromises.push(
          client.from("users").update(sanitizedUsers).eq("id", userId)
        );
      }
    }

    if (updatePromises.length > 0) {
      const results = await Promise.all(updatePromises);
      for (const result of results) {
        if (result.error) {
          console.error("Supabase update error:", result.error);
          throw result.error;
        }
      }
    }

    // 3. Fetch and return the updated doctor with joined users
    const { data: updatedDoctor, error: fetchError } = await client
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
      .eq("id", doctorId)
      .single();

    if (fetchError) throw fetchError;

    return updatedDoctor;
  },
};

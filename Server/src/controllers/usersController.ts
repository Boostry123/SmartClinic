import { supabaseAdmin } from "../config/supaAdmin.js";

// Define the shape of the data this controller expects
interface CreateUserParams {
  email: string;
  password: string;
  role: string;
  name: string;
  last_name: string;
  national_id_number: string;
}

export const createNewUser = async (params: CreateUserParams) => {
  const { email, password, role, name, last_name, national_id_number } = params;

  // Use the Admin Client to bypass restrictions
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, name, last_name, national_id_number }, // Postgres Trigger will read this
  });

  if (error) {
    throw error;
  }

  return data;
};

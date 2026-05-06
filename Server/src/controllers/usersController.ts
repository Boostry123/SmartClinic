import { supabaseAdmin } from "../config/supaAdmin.js";
import { logInfo, logError } from "../utils/logger.js";
import LogAction from "../types/enums/logActions.js";
import { LogEntityType } from "../types/logs.js";

// Define the shape of the data this controller expects
interface CreateUserParams {
  email: string;
  password: string;
  role: string;
  name: string;
  last_name: string;
  national_id_number: string;
  //optional fields for secretaries created by admin
  doctor_id?: string;
}

export const createNewUser = async (
  params: CreateUserParams,
  actingUserId: string = "admin",
) => {
  const {
    email,
    password,
    role,
    name,
    last_name,
    national_id_number,
    doctor_id,
  } = params;

  // Use the Admin Client to bypass restrictions
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      name,
      last_name,
      national_id_number,
      doctor_id, //NEEDED FOR SECRETARY ROLE ONLY
    },
  });

  if (error) {
    throw error;
  }

  await logInfo({
    userId: actingUserId,
    action: LogAction.CREATE_USER,
    entityType: LogEntityType.USER,
    entityId: data.user?.id,
    metadata: { email, role },
  });

  return data;
};

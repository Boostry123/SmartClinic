import userTypes from "../types/enums/userTypes.js";

export const UserService = {
  // Accepts 'role' as a parameter so you can reuse this for doctors, admins, etc.
  getUsersByRole: (client: any, role: userTypes) => {
    return client.from("users").select("*").eq("role", role);
  },
};

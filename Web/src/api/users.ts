import apiClient from "./axiosClient";
//TYPES
import type { CreateUserData } from "./types/users";

export const createUser = async (userData: CreateUserData) => {
  const response = await apiClient.post("/users/create", userData);

  return response.data;
};

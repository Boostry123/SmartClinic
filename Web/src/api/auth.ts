import apiClient from "./axiosClient";
import type { AuthResponse } from "../types/auth";

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return data;
};
export const signupUser = async (
  email: string,
  password: string,
  name: string,
  lastName: string
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/signup", {
    email,
    password,
    name,
    last_name: lastName,
  });

  return data;
};

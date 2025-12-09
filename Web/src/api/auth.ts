// src/api/auth.ts
import axios from "axios";
import type { AuthResponse } from "../types/auth";

// Assuming you have a base URL set up, or use absolute paths
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const signupUser = async (
  email: string,
  password: string,
  name: string,
  lastName: string
) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    email,
    password,
    name,
    last_name: lastName,
  });
  return response.data;
};

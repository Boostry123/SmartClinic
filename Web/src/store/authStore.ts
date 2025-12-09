import { create } from "zustand";
import type { User } from "../types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  getIsAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initialize from localStorage so login persists on refresh
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("token"),
  getIsAuthenticated: () => {
    const states = get();
    return states.isAuthenticated;
  },

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

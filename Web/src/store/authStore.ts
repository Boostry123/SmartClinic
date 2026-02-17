import { create } from "zustand";
import type { UserProfile } from "../types/auth";

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;

  // Derived state
  isAuthenticated: boolean;

  // Actions
  setAuth: (accessToken: string, user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state (rehydrated from localStorage)
  accessToken: localStorage.getItem("accessToken"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("accessToken"),

  // Set auth after login or token refresh
  setAuth: (accessToken, user) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },

  // Clear everything on logout / refresh failure
  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));

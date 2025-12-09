// src/services/auth.ts
import supabase from "../config/supaDb.js";
import userTypes from "../types/enums/userTypes.js";

// 1. Sign Up
export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: userTypes
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: firstName, // Matches your DB trigger
        last_name: lastName, // Matches your DB trigger
        role: role, // Matches your DB trigger
      },
    },
  });
  return { data, error };
};

// 2. Sign In
export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// 3. Sign Out
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

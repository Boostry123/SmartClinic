// src/types/auth.ts

// What the User looks like (from your DB)
export interface User {
  id: string;
  email: string;
  name: string;
  last_name: string;
  role: "admin" | "doctor" | "patient" | "secretary";
}

// What the Node.js Login endpoint returns
export interface AuthResponse {
  accessToken: string; // The Supabase JWT
  user: User;
}

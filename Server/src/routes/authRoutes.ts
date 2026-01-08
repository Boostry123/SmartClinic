// backend/routes/auth.js
import { Router } from "express";
import supabase from "../config/supaDb.js";

const AuthRoutes = Router();

// POST /auth/signup
AuthRoutes.post("/signup", async (req, res) => {
  const { email, password, name, last_name } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, last_name } },
  });

  if (error) return res.status(400).json({ error: error.message });

  // Send accessToken so frontend can call setAuth()
  res.json({
    accessToken: data.session?.access_token || null,
    user: data.user,
  });
});

AuthRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  // Send accessToken (matches frontend store) and user
  res.json({
    accessToken: data.session.access_token, // renamed
    user: data.user,
  });
});
// POST /auth/refresh
AuthRoutes.post("/refresh", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session)
      return res.status(401).json({ error: "Unable to refresh session" });

    res.json({
      accessToken: data.session.access_token,
      user: data.session.user,
    });
  } catch (err) {
    res.status(500).json({ error: "Refresh failed" });
  }
});
// POST /auth/logout
AuthRoutes.post("/logout", async (req, res) => {
  try {
    // Revoke refresh token on Supabase
    await supabase.auth.signOut();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
});

export default AuthRoutes;

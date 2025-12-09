// backend/routes/auth.js
import { Router } from "express";
import supabase from "../config/supaDb.js";

const AuthRoutes = Router();

// POST /api/auth/signup
AuthRoutes.post("/signup", async (req, res) => {
  const { email, password, name, last_name } = req.body;

  // 1. The Node server talks to Supabase
  //the  role is defauled to 'patient' in the DB trigger
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, last_name }, // Sends metadata for the DB Trigger
    },
  });

  if (error) return res.status(400).json({ error: error.message });

  // 2. Send the result back to Frontend
  res.json({ user: data.user, session: data.session });
});

// POST /api/auth/login
AuthRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Authenticate with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  // 2. IMPORTANT: Send the Access Token (Bearer) to the Frontend
  res.json({
    token: data.session.access_token,
    user: data.user,
  });
});

export default AuthRoutes;

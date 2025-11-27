import { Router } from "express";
// prefer importing the TS module path (remove or keep .js depending on your runtime/tsconfig)
import supabase from "../config/supaDb.js";
const router = Router();


// Define a route to get all users
router.get('/', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized" });
    }

    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err: any) {
    console.error(`Fetching users failed: ${err?.message ?? err}`);
    res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
});

export default router;

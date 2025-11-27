import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

/*
    this file sets up and exports a Supabase client instance
    this will allow other developers to work on the same database.
*/
// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Initialize with the Service Key
let supabase: SupabaseClient | null = null;
if(supabaseUrl && supabaseServiceKey){
    supabase = createClient(supabaseUrl, supabaseServiceKey);
}else{
    console.log("there is a problem creating a supabase client.")
}


export default supabase as SupabaseClient
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

// We export a query function that will be used throughout the application
// to interact with the database.
export const query = (text: string, params?: any[]) => pool.query(text, params);

console.log("Database connection pool created.");

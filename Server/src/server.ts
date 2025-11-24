import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for requests from your frontend
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- API Routes ---
// This tells the server what to do when it gets a GET request for the homepage '/'
app.get("/", (req, res) => {
  // You can send back a simple message...
  res.send("Welcome to the server page.");
});

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

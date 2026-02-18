import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//routes
import UserRoutes from "./routes/userRoutes.js";
import AuthRoutes from "./routes/authRoutes.js";
import PatientRoutes from "./routes/patientRoutes.js";
import TreatmentRoutes from "./routes/treatmentRoute.js";
import AppointmentRoutes from "./routes/appointmentRoutes.js";
import SecretaryRoutes from "./routes/secretaryRoute.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for requests from your frontend
app.use(
  cors({
    origin: process.env.BASE_FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
// Parse incoming JSON requests
app.use(express.json());

// --- API Routes ---
// This tells the server what to do when it gets a GET request for the homepage '/'
app.get("/", (req, res) => {
  // You can send back a simple message...
  res.send("Welcome to the server page.");
});

//the users route
app.use("/users", UserRoutes);
//the patients route
app.use("/patients", PatientRoutes);
//the secretary route
app.use("/secretaries", SecretaryRoutes);
//the treatments route
app.use("/treatments", TreatmentRoutes);
//the appointments route
app.use("/appointments", AppointmentRoutes);
//the auth route
app.use("/auth", AuthRoutes);
// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

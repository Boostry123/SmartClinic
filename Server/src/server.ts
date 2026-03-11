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
import DoctorRoutes from "./routes/doctorRoutes.js";
import ChatbotRoutes from "./routes/chatbot.js";
import { rateLimiter, authRateLimiter } from "./middleware/security.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "https://smartclinic.pages.dev", // Your main production URL
  "http://localhost:5173", // Your local development
];

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for requests from your frontend
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in our list OR if it's a Cloudflare preview URL
      const isCloudflarePreview = origin.endsWith(".smartclinic.pages.dev");

      if (allowedOrigins.indexOf(origin) !== -1 || isCloudflarePreview) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Parse incoming JSON requests
app.use(express.json());
// Apply general rate limiting to all routes
app.use(rateLimiter);
// Apply stricter rate limiting to authentication routes
app.use("/auth", authRateLimiter);
// --- API Routes ---
// This tells the server what to do when it gets a GET request for the homepage '/'
app.get("/", (req, res) => {
  // You can send back a simple message...
  res.send("Welcome to the server page.");
});

//the users route
app.use("/users", UserRoutes);
//the doctors route
app.use("/doctors", DoctorRoutes);
//the patients route
app.use("/patients", PatientRoutes);
//the secretary route
app.use("/secretaries", SecretaryRoutes);
//the treatments route
app.use("/treatments", TreatmentRoutes);
//the appointments route
app.use("/appointments", AppointmentRoutes);
//the chatbot route
app.use("/chatbot", ChatbotRoutes);
//the auth route
app.use("/auth", AuthRoutes);
// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

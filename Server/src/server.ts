import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
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
import healthCheckRoutes from "./routes/healthCheckRoutes.js";
import DocumentRoutes from "./routes/documentRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

const allowedOrigins = [
  "https://smartclinic.pages.dev", // Your main production URL
  "http://localhost:5173", // Your local development
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin) return callback(null, true);
    const isCloudflarePreview = origin.endsWith(".smartclinic.pages.dev");
    if (allowedOrigins.indexOf(origin) !== -1 || isCloudflarePreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 3. Initialize Socket.io with the HTTP server and the CORS config
const io = new Server(server, {
  cors: corsOptions,
});
app.set("io", io);
// Enable Cross-Origin Resource Sharing for requests from your frontend
// --- Middleware ---
app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(express.json());
app.use(rateLimiter);
app.use("/auth", authRateLimiter);

// --- API Routes ---
// This tells the server what to do when it gets a GET request for the homepage '/'
app.get("/", (req, res) => {
  // You can send back a simple message...
  res.send("Welcome to the server page.");
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
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
//the documents route
app.use("/documents", DocumentRoutes);
//the auth route
app.use("/auth", AuthRoutes);
//health check route
app.use("/healthCheck", healthCheckRoutes);
// --- Server Activation ---
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

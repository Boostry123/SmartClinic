import { Router } from "express";
// Tanstack AI
import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { geminiText } from "@tanstack/ai-gemini";
// third-party
import { rateLimit } from "express-rate-limit";
// Controllers
import { getAppointments } from "../controllers/appointmentsController.js";
//tools
import { getAppointmentsToolDef } from "../chatTools/appointmentTools.js";
// Middleware
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
//types
import type {
  Appointment,
  AppointmentFilters,
} from "../types/enums/appointmentTypes.js";
import { getUserDetails } from "../services/auth.js";
import { getDoctors } from "../controllers/doctorsController.js";

const ChatbotRoutes = Router();

// Rate limiter
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// ------------------ TOOL ------------------

const getAppointmentsTool = (token: string) =>
  getAppointmentsToolDef.server(async (args) => {
    const filters = { ...(args as Record<string, any>) } as AppointmentFilters;

    const { data, error } = await getAppointments(token, filters);

    if (error || !data) {
      console.error("Tool Error:", error);
      throw new Error(`Failed to fetch appointments: ${error}`);
    }
    // ----------------------------------------------
    return {
      appointments: data.map((appt: Appointment) => ({
        id: appt.id,
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
        treatment_id: appt.treatment_id,
        treatment_data: appt.treatment_data || {},
        start_time: appt.start_time,
        end_time: appt.end_time,
        status: appt.status,
        notes: appt.notes || "",
        created_at: appt.created_at,

        patients: {
          first_name: appt.patients?.first_name || "",
          last_name: appt.patients?.last_name || "",
        },
        doctors: {
          specialization: appt.doctors?.specialization || "",
          users: {
            name: appt.doctors?.users?.name || "",
            last_name: appt.doctors?.users?.last_name || "",
            email: appt.doctors?.users?.email || "",
          },
        },
      })),
    };
  });

const getSystemPrompt = (doctorId: string) => {
  return `
# IDENTITY
You are the SmartClinic Operations Assistant. You help doctors manage their schedule and patient data.
Your unique Doctor ID is: ${doctorId}.

# GUIDELINES
- Assisting Doctor ID: ${doctorId}. 
- Use this ID to filter "my schedule" or "my appointments".
- Current Time: ${new Date().toLocaleString()} (ISO: ${new Date().toISOString()})
- Week Range: [Sunday to Saturday].
- **Empty States**: If no appointments are found for a requested period, say: "You have no appointments scheduled for [Date/Period]."

# RESPONSE STYLE
- Be concise and clinical.
- **Markdown Tables**: Always use tables for lists. 
- **Required Columns**: | Patient | Time | Status | Treatment |
- **Data Formatting**:
    - Names: **John Doe** (Bold)
    - Dates: "Tue, Mar 24 | 9:30 AM"
    - Status: Human-friendly (e.g., "Checked In", "Scheduled", "Completed")
- **Privacy**: No medical notes unless specifically requested.
`;
};

// ------------------ ROUTE ------------------
ChatbotRoutes.post(
  "/",
  authMiddleware,
  chatbotLimiter,
  async (req: AuthRequest, res) => {
    const token = req.token;
    const { messages, conversationId } = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // 1. Role Check
      const {
        data: { user },
        error: userError,
      } = await getUserDetails(token);

      if (userError || !user) {
        return res.status(401).json({ error: "Invalid session." });
      }

      if (user.user_metadata?.role !== "doctor") {
        return res
          .status(403)
          .json({ error: "Access Denied: Only doctors can use the chatbot." });
      }

      // 2. Get the doctor id to identify the doctor
      const doctorResponse = await getDoctors(token, { user_id: user.id });
      const doctorId = doctorResponse.data?.[0]?.id as string;

      if (!doctorId) {
        return res.status(404).json({ error: "Doctor record not found." });
      }

      // 3. API KEY CHECK (ADD THIS HERE)
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "No API key provided" });
      }

      // 4. Initialize stream
      const stream = chat({
        adapter: geminiText("gemini-2.5-flash"),
        messages: [
          { role: "system", content: getSystemPrompt(doctorId) },
          ...(Array.isArray(messages) ? messages : [messages]),
        ],
        conversationId: conversationId,
        stream: true,
        tools: [getAppointmentsTool(token)],
      });

      // ✅ Get Web Response
      const response = toServerSentEventsResponse(stream);

      // ✅ Set correct SSE headers for Express
      res.status(response.status);
      response.headers.forEach((value: string, key: string) => {
        res.setHeader(key, value);
      });

      // ✅ Pipe Web stream to Express
      if (!response.body) {
        return res.end();
      }

      const reader = response.body.getReader();

      req.on("close", () => {
        reader.cancel();
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }

      res.end();
    } catch (error) {
      console.error("Chat Stream Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Chat stream failed" });
      }
    }
  },
);

export default ChatbotRoutes;

import { Router } from "express";
// Tanstack AI
import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { geminiText } from "@tanstack/ai-gemini";
// third-party
import { rateLimit } from "express-rate-limit";
// Config
import { getSupabaseClient } from "../config/supaDb.js";
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
    const { data, error } = await getAppointments(
      token,
      args as AppointmentFilters,
    );

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

// ------------------ ROUTE ------------------
ChatbotRoutes.post(
  "/",
  authMiddleware,
  chatbotLimiter,
  async (req: AuthRequest, res) => {
    const token = req.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Role Check
      const supabase = getSupabaseClient(token);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return res.status(401).json({ error: "Invalid session." });
      }

      if (user.user_metadata?.role !== "doctor") {
        return res
          .status(403)
          .json({ error: "Access Denied: Only doctors can use the chatbot." });
      }

      const systemPrompt = `
  You are an expert Clinic Operations Assistant. 
  TODAY'S DATE: ${new Date().toISOString()}

  CORE INSTRUCTIONS:
  1. DATE AWARENESS: Use the CURRENT_TIME above to calculate ISO strings. 
     - "Today" is from 00:00:00 to 23:59:59 of the current date.
     - "This week" starts from TODAY'S DATE to the upcoming Saturday 23:59:59.
     - "Next week" starts from sunday to saturday of the following week.
     - "Dont fetch past appointments unless asked specifically to do so, focus on upcoming appointments by providing todays date to the start_time filter."
  2. ROLE AWARENESS: The user is a doctor. Tailor responses to their perspective.
     - if an ID is given proritize it for the filtering.
     - if a patient name is given fetch all appointments according to date awareness and then identify the patient name given.
  3. DATA ANALYSIS: When you receive appointment data, don't just list it. Summarize it. 
     - If asked "How is my day looking?", identify gaps between appointments or back-to-back sessions.
     - If a patient is mentioned by name, use the 'patient_name' that will be found after fetching all appointments and inside patients.first_name.
  4. PRIVACY: Only provide medical notes if specifically asked.
`;
      const stream = chat({
        adapter: geminiText("gemini-2.5-flash"),
        messages: [
          req.body.messages,
          { role: "system", content: systemPrompt },
        ],
        conversationId: req.body.conversationId,
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
      res.status(500).json({ error: "Chat stream failed" });
    }
  },
);

export default ChatbotRoutes;

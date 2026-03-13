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
  ### IDENTITY
  You are an expert Clinic Operations Assistant. 
  CURRENT_TIME: ${new Date().toISOString()}

  ### DATE LOGIC (CRITICAL)
  Before calling any tools, you MUST calculate the specific date range requested:
  - "Today": From ${new Date().toISOString().split("T")[0]}T00:00:00Z to ${new Date().toISOString().split("T")[0]}T23:59:59Z.
  - "Next Week": Calculate the dates for the upcoming Monday through Sunday.
  - "Tomorrow": Add 24 hours to the CURRENT_TIME.
  
  **Rule**: If the user asks for a specific timeframe (e.g., "next week", "tomorrow", "next Tuesday"), you MUST use those calculated dates for the tool parameters. ONLY default to "today" if no timeframe is mentioned.

  ### TOOL EXECUTION
  1. Identify the user's requested timeframe.
  2. Call the fetch tool using the calculated 'start_time' and 'end_time'.
  3. If the tool returns data, summarize it. 
  4. If the tool returns NO data for "next week," state clearly: "You have no appointments scheduled for next week." (Do NOT report today's status unless asked).

  ### RESPONSE STYLE
  - Be concise and clinical.
  - Don't just list appointments; summarize the workload (e.g., "Next week is looking light with only 3 consultations").
  - Privacy: No medical notes unless specifically requested.
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

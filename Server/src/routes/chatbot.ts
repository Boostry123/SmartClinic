import { Router } from "express";
// Tanstack AI
import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { geminiText } from "@tanstack/ai-gemini";
import { ollamaText } from "@tanstack/ai-ollama";
// third-party
import { rateLimit } from "express-rate-limit";
//tools
import {
  createAppointmentsTool,
  getAppointmentsTool,
} from "../chatTools/appointmentTools.js";
import { getTreatmentsTool } from "../chatTools/treatmentTools.js";
import { getPatientsTool } from "../chatTools/patientTools.js";
// Middleware
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
//services
import { getUserDetails } from "../services/auth.js";
//controllers
import { getDoctors } from "../controllers/doctorsController.js";
import { getCurrentDateTool } from "../chatTools/getdateTool.js";

const ChatbotRoutes = Router();

// Rate limiter
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

//-------------------CONTEXT PROMPT-------------------
const getSystemPrompt = (doctorId: string) => {
  return `
# IDENTITY
You are the SmartClinic Operations Assistant. You help doctors manage their schedule and patient data.
Your unique Doctor ID is: ${doctorId}.

# CALENDAR RULES (STRICT)
- **Week Definition**: A week ALWAYS starts on Sunday and ends on Saturday.
- **Day Sequence**: 1: Sunday, 2: Monday, 3: Tuesday, 4: Wednesday, 5: Thursday, 6: Friday, 7: Saturday.
- **"This Week"**: Refers to the period from the most recent Sunday to the upcoming Saturday.
- **"Weekend"**: Refers to Friday and Saturday.
- **Reference Time**: ${new Date().toLocaleString()} (Current Day: ${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())})

# GUIDELINES
- Assisting Doctor ID: ${doctorId}.
- Use this ID to filter "my schedule" or "my appointments".
- **Empty States**: If no appointments are found for a requested period, say: "You have no appointments scheduled for [Date/Period]."

# RESPONSE STYLE
- Be concise and clinical.
- **Markdown Tables**: 
    - For **Appointment Lists**: Use columns | Patient | Time | Status | Treatment |
    - For **Patient Search Results** (multiple): Use columns | Name | National Id | Phone |
    - For **Single Patient Details**: Use a 2-column "Property | Value" table to avoid horizontal overflow (e.g., | Field | Detail |).
- **Data Formatting**:
    - Names: **John Doe** (Bold)
    - Dates: "Tue, Mar 24 | 9:30 AM"
    - Status: Human-friendly (e.g., "Checked In", "Scheduled", "Completed")
- **Privacy**: No medical notes unless specifically requested.

CRITICAL FORMATTING RULES:
- Always format your responses using rich, clean Markdown.
- Avoid things like Ids or serial numbers and emojys in the output unless explicitly asked for.
- Use headers (###) to separate distinct sections of your analysis or patient data.
- Use bold text (**word**) to highlight critical items like patient names, medication dosages, or urgent dates.
- Use bullet points (-) when listing appointments, medical history, or treatments. Never write lists as flat paragraphs.
- Keep text concise and layout-driven so the doctor can read it at a glance.
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

      // 3. API KEY CHECK
      const geminiKey = process.env.GEMINI_API_KEY;
      const ollamaHost = process.env.OLLAMA_HOST;
      const aiProvider =
        process.env.AI_PROVIDER || (ollamaHost ? "ollama" : "gemini");

      if (aiProvider === "gemini" && !geminiKey) {
        return res.status(500).json({
          error: "Server configuration error: Missing Gemini API key.",
        });
      }

      if (aiProvider === "ollama" && !ollamaHost) {
        return res.status(500).json({
          error: "Server configuration error: Missing Ollama URL.",
        });
      }

      // 4. Select Adapter
      const adapter =
        aiProvider === "ollama"
          ? ollamaText("qwen3:4b")
          : geminiText("gemini-2.5-flash");

      console.log(`[Chatbot] Using AI Provider: ${aiProvider}`);

      let stream = undefined;

      if (aiProvider === "ollama") {
        // Initialize stream for ollama
        stream = chat({
          adapter,
          systemPrompts: [getSystemPrompt(doctorId)],
          messages: [...(Array.isArray(messages) ? messages : [messages])],
          conversationId: conversationId,
          modelOptions: {
            num_ctx: 8192,
            temperature: 0,
            top_p: 0.1,
          },
          stream: true,
          tools: [
            getAppointmentsTool(token),
            getTreatmentsTool(token),
            getPatientsTool(token),
            createAppointmentsTool(token),
            getCurrentDateTool,
          ],
        });
      } else if (aiProvider === "gemini") {
        // Initialize stream for gemini
        stream = chat({
          adapter: geminiText("gemini-2.5-flash"),
          messages: [
            { role: "system", content: getSystemPrompt(doctorId) },
            ...(Array.isArray(messages) ? messages : [messages]),
          ],
          conversationId: conversationId,
          stream: true,
          tools: [
            getAppointmentsTool(token),
            getTreatmentsTool(token),
            getPatientsTool(token),
            createAppointmentsTool(token),
          ],
        });
      }

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

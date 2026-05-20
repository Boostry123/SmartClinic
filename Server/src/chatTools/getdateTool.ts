import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const getCurrentDateTool = toolDefinition({
  name: "getCurrentDate",
  description:
    "Retrieves the absolute current system date, local time, and day of the week. Use this whenever the user asks for 'today', 'tomorrow', 'yesterday' or needs the current calendar anchor.",
  inputSchema: z.object({}), // No parameters needed
  outputSchema: z.object({
    dateString: z.string().describe("The current date in YYYY-MM-DD format"),
    localTime: z.string().describe("The current local time in HH:MM format"),
    dayOfWeek: z.string().describe("The full name of the day of the week"),
    fullContext: z
      .string()
      .describe("Human readable breakdown of the current local timestamp"),
  }),
}).server(async () => {
  const now = new Date();

  // Create clean local formats bypassing UTC timezone shifts
  const dateString = now.toLocaleDateString("en-CA"); // Formats beautifully as YYYY-MM-DD
  const localTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }); // 24h format HH:MM
  const dayOfWeek = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(now);

  return {
    dateString,
    localTime,
    dayOfWeek,
    fullContext: `${dayOfWeek}, ${dateString} at ${localTime}`,
  };
});

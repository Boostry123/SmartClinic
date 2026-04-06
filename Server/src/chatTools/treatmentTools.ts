import { z } from "zod";
import { toolDefinition } from "@tanstack/ai";
import type {
  Treatment,
  filterTreatment,
} from "../types/enums/treatmentTypes.js";
import { getTreatments } from "../controllers/treatmentsController.js";

export const getTreatmentsToolDef = toolDefinition({
  name: "fetch_treatments",
  description:
    "Search and retrieve clinical treatments or templates available in the system.",
  inputSchema: z.object({
    id: z.string().optional(),
    treatment_name: z.string().optional().describe("Name of the treatment"),
    estimated_time: z
      .number()
      .optional()
      .describe("Estimated duration of the treatment in minutes"),
    created_by: z
      .string()
      .optional()
      .describe("UUID of the user who created the treatment"),
  }),
  outputSchema: z.object({
    treatments: z.array(
      z.object({
        id: z.string().describe("unique identifier for the treatment"),
        treatment_name: z.string().nullable(),
        estimated_time: z.number().nullable(),
        created_at: z.string(),
        created_by: z.string(),
        template: z.record(z.string(), z.any()).nullable(),
      }),
    ),
  }),
});

export const getTreatmentsTool = (token: string) =>
  getTreatmentsToolDef.server(async (args) => {
    const filters = { ...(args as Record<string, any>) } as filterTreatment;

    const { data, error } = await getTreatments(token, filters);

    if (error || !data) {
      console.error("Tool Error:", error);
      throw new Error(`Failed to fetch treatments: ${error}`);
    }

    return {
      treatments: data.map((treatment: Treatment) => ({
        id: treatment.id,
        treatment_name: treatment.treatment_name,
        estimated_time: treatment.estimated_time,
        created_at: treatment.created_at,
        created_by: treatment.created_by,
        template: treatment.template || {},
      })),
    };
  });

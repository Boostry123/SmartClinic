import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createTreatment } from "../controllers/treatmentsController.js";
import type { AuthRequest } from "../middleware/auth.js";
import type { CreateTreatmentDTO } from "../types/enums/treatmentTypes.js";

const TreatmentRoutes = Router();

TreatmentRoutes.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const token = req.token;
  const { treatment_name, estimated_time, template }: CreateTreatmentDTO =
    req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (treatment_name && treatment_name.length > 30) {
    return res
      .status(400)
      .json({ error: "Treatment name must be 30 characters or less" });
  }

  try {
    const { data, error } = await createTreatment(token, {
      treatment_name,
      estimated_time,
      template: template || {},
    });

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error || "Internal Server Error" });
  }
});

export default TreatmentRoutes;

import { Router, type Response } from "express";
//middleware
import upload, { type MulterRequest } from "../middleware/multer.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
//controllers
import {
  uploadDocument,
  getDocumentUrl,
  listAllDocuments,
} from "../controllers/documentController.js";
//services
import { getUserDetails } from "../services/auth.js";
//types
import type {
  DocumentUploadResult,
  DocumentUploadResponse,
} from "../types/enums/documentTypes.js";

const DocumentRoutes = Router();

// List all documents across all user folders
DocumentRoutes.get(
  "/all",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const token = req.token;

      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { data, error } = await listAllDocuments(token);

      if (error) {
        res.status(500).json({ error });
        return;
      }

      res.status(200).json(data);
    } catch (err: any) {
      console.error("Error listing all documents:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Retrieve a document's public URL
DocumentRoutes.get(
  "/url",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const token = req.token;
      const { filePath } = req.query;

      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (!filePath || typeof filePath !== "string") {
        res.status(400).json({ error: "filePath query parameter is required" });
        return;
      }

      const result = getDocumentUrl(token, filePath);
      res.status(200).json(result);
    } catch (err: any) {
      console.error("Error retrieving document URL:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

//Uploading a public document
DocumentRoutes.post(
  "/upload",
  authMiddleware,
  upload.any(),
  async (req: AuthRequest, res: Response) => {
    try {
      const multerReq = req as MulterRequest;
      const token = req.token;

      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Fetch user details from token
      const { data: userData, error: userError } = await getUserDetails(token);

      if (userError || !userData?.user) {
        res.status(401).json({
          error: "Invalid token or user not found",
          details: userError?.message,
        });
        return;
      }

      const userId = userData.user.id;
      const { fileName } = multerReq.body;

      if (!multerReq.files || multerReq.files.length === 0) {
        res.status(400).json({ error: "No files were uploaded" });
        return;
      }

      const results: DocumentUploadResult[] = [];
      const errors: { fileName: string; error: string }[] = [];

      const files: Express.Multer.File[] = Array.isArray(multerReq.files)
        ? (multerReq.files as Express.Multer.File[])
        : (Object.values(multerReq.files).flat() as Express.Multer.File[]);

      // Process each file uploaded
      for (const file of files) {
        // Use provided fileName or original name if not provided
        const currentFileName = fileName || file.originalname.split(".")[0];

        const { data, publicUrl, error } = await uploadDocument(
          token,
          userId,
          file,
          currentFileName,
        );

        if (error) {
          errors.push({ fileName: fileName || file.originalname, error });
        } else {
          results.push({
            fileName: fileName || file.originalname,
            data,
            publicUrl,
          });
        }
      }

      if (errors.length > 0 && results.length === 0) {
        res.status(500).json({ error: "All uploads failed", errors });
        return;
      }

      const response: DocumentUploadResponse = {
        message: "Upload completed",
        results,
        ...(errors.length > 0 ? { errors } : {}),
      };

      res.status(200).json(response);
    } catch (err: any) {
      console.error("Internal Server Error in Document Upload:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

export default DocumentRoutes;

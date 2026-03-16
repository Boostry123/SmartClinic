import type { Request } from "express";
import multer from "multer";

// Use Multer's native type definition
export interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

// Memory storage is best for security (no disk footprint)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB for clinical photos
  },
});

export default upload;

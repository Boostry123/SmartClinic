import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  token?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check that header exists and starts with Bearer
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  // Extract token from header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  // Attach to request
  req.token = token;

  next();
};

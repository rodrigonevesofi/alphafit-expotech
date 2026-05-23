import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; role: string; name: string; email: string };
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, message: "Token não informado." });

  const [, token] = header.split(" ");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "alphafit_dev_secret") as any;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Token inválido." });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Acesso restrito ao administrador." });
  }
  return next();
}

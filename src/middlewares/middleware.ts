import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido ou inválido." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido ou inválido." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET não configurado no ambiente");
    return res.status(500).json({ message: "Chave secreta do JWT não configurada." });
  }

  try {
    const decoded = jwt.verify(token, "CHAVE_SECRETA_PROVISORIA") as JwtPayload;

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("id" in decoded) ||
      !("role" in decoded) ||
      typeof (decoded as any).id !== "string" ||
      typeof (decoded as any).role !== "string"
    ) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    req.user = {
      id: (decoded as any).id,
      role: (decoded as any).role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
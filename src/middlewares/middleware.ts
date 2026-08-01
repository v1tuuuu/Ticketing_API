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

  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    console.error("JWT_SECRET não configurado no ambiente");
    // Em produção, é melhor enviar uma mensagem genérica.
    return res.status(500).json({ message: "Erro interno do servidor." });
  }

  try {
    // Usa a variável de ambiente para verificar o token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Anexa o payload decodificado (id, role) ao objeto da requisição
    req.user = decoded;

    return next();
  } catch (error) {
    // jwt.verify lança um erro para tokens inválidos ou expirados
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
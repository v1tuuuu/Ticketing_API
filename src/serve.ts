import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const envFile = process.env['NODE_ENV'] === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const { connectPrismaWithRetry } = await import("./prisma.js");
const { default: eventRoutes } = await import("./routes/eventRoutes.js");
const { default: userRoutes } = await import("./routes/userRoutes.js");

export const app = express(); // Exportado para uso nos testes de integração
const PORT = process.env['PORT'] || 3000;

// Configuração de CORS mais segura
const corsOptions = {
  // Em produção, restrinja a origem para a URL do seu frontend.
  // Em desenvolvimento, `true` reflete a origem da requisição (ex: localhost:5173).
  origin: process.env['NODE_ENV'] === 'production'
    ? process.env['FRONTEND_URL'] // Você precisará definir esta variável de ambiente em produção
    : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Registro das rotas
app.use("/api", eventRoutes);
app.use("/api/auth", userRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (process.env['NODE_ENV'] !== 'test') {
  connectPrismaWithRetry()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Falha ao conectar ao banco de dados:', error);
      process.exit(1);
    });
}

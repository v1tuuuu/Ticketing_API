import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

// 1. Cria o pool de conexão nativo do driver do PostgreSQL
const pool = new Pool({
  connectionString:
    process.env['DATABASE_URL'] ||
    'postgresql://admin:password123@localhost:5432/ticketing?schema=public',
});

// 2. Instancia o adaptador necessário para a arquitetura do Prisma 7
const adapter = new PrismaPg(pool);

// 3. Exporta o cliente do Prisma injetando o adaptador
export const prisma = new PrismaClient({ adapter });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function connectPrismaWithRetry(retries = 5, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await prisma.$connect();
      return;
    } catch (error) {
      console.warn(
        `Prisma connection attempt ${attempt} failed.${attempt < retries ? ` Retrying in ${delayMs}ms...` : ''}`
      );
      if (attempt === retries) {
        throw error;
      }
      await sleep(delayMs);
    }
  }
}
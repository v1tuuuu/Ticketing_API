import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  // No Prisma 7, passamos o caminho do schema diretamente como string
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
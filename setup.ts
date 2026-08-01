import { beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from './src/prisma.js';

// Este arquivo é um bom lugar para configurar mocks globais
// ou outras lógicas que precisam rodar antes/depois dos testes.

beforeAll(() => {
  console.log('🚀 Iniciando suíte de testes...');
});

// Limpa o banco de dados antes de cada teste para garantir o isolamento
beforeEach(async () => {
  // A ordem é importante para evitar erros de chave estrangeira
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(() => {
  console.log('✅ Suíte de testes finalizada.');
});
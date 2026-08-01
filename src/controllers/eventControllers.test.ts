import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from './eventControllers.js';
import { prisma } from '../prisma.js';

// Mock do Prisma para isolar os controllers
vi.mock('../prisma.js', () => ({
  prisma: {
    event: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const createMockReq = (overrides: Record<string, unknown> = {}) => ({
  body: {},
  params: {},
  user: undefined,
  ...overrides,
}) as any;

const createMockRes = () => {
  const res = {
    statusCode: 200,
  } as any;

  res.status = vi.fn().mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);

  return res;
};

describe('Event Controllers', () => {
  let res: ReturnType<typeof createMockRes>;

  beforeEach(() => {
    res = createMockRes();
    vi.clearAllMocks();
  });

  // --- Testes para createEvent ---
  describe('createEvent', () => {
    it('deve criar um evento com sucesso', async () => {
      const req = createMockReq({
        body: {
          title: 'Evento de Teste',
          date: '2025-12-25T19:00:00.000Z',
          location: 'Local de Teste',
        },
        // Simula o usuário autenticado pelo middleware
        user: { id: 'user-id-123', role: 'CLIENT' },
      });

      const mockEvent = {
        id: 'event-id-456',
        title: 'Evento de Teste',
        date: new Date('2025-12-25T19:00:00.000Z'),
        location: 'Local de Teste',
        userId: 'user-id-123',
      };

      vi.mocked(prisma.event.create).mockResolvedValue(mockEvent as any);

      await createEvent(req, res);

      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          title: 'Evento de Teste',
          description: null,
          date: new Date('2025-12-25T19:00:00.000Z'),
          location: 'Local de Teste',
          organizer: {
            connect: { id: 'user-id-123' },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const req = createMockReq({
        body: { title: '' }, // Título inválido
        user: { id: 'user-id-123', role: 'CLIENT' },
      });

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
    });
  });

  // --- Testes para getEvents ---
  describe('getEvents', () => {
    it('deve retornar uma lista de eventos', async () => {
      const req = createMockReq();
      const mockEvents = [{ id: '1', title: 'Evento 1' }, { id: '2', title: 'Evento 2' }];

      vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

      await getEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });
  });

  // --- Testes para getEventById ---
  describe('getEventById', () => {
    it('deve retornar um evento pelo ID', async () => {
      const req = createMockReq({ params: { id: 'event-id-123' } });
      const mockEvent = { id: 'event-id-123', title: 'Evento Específico' };

      vi.mocked(prisma.event.findUnique).mockResolvedValue(mockEvent as any);

      await getEventById(req, res);

      expect(prisma.event.findUnique).toHaveBeenCalledWith({ where: { id: 'event-id-123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it('deve retornar erro 404 se o evento não for encontrado', async () => {
      const req = createMockReq({ params: { id: 'id-nao-existe' } });

      vi.mocked(prisma.event.findUnique).mockResolvedValue(null);

      await getEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Evento não encontrado.' });
    });
  });

  // --- Testes para updateEvent ---
  describe('updateEvent', () => {
    it('deve atualizar um evento com sucesso', async () => {
      const req = createMockReq({
        params: { id: 'event-id-123' },
        body: { title: 'Título Atualizado' },
        user: { id: 'user-id-123', role: 'CLIENT' },
      });

      // Simula a busca do evento para a verificação de permissão
      const existingEvent = { id: 'event-id-123', userId: 'user-id-123' };
      vi.mocked(prisma.event.findUnique).mockResolvedValue(existingEvent as any);

      // Simula a atualização bem-sucedida
      const updatedEvent = { id: 'event-id-123', title: 'Título Atualizado' };
      vi.mocked(prisma.event.update).mockResolvedValue(updatedEvent as any);

      await updateEvent(req, res);

      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: 'event-id-123' },
        data: { title: 'Título Atualizado' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedEvent);
    });

     it('deve retornar erro 403 se o usuário não for o organizador', async () => {
      const req = createMockReq({
        params: { id: 'event-id-123' },
        body: { title: 'Título Atualizado' },
        user: { id: 'outro-user-id', role: 'CLIENT' }, // ID de usuário diferente
      });

      // Simula que o evento existe e pertence a outro usuário
      const existingEvent = { id: 'event-id-123', userId: 'user-id-original' };
      vi.mocked(prisma.event.findUnique).mockResolvedValue(existingEvent as any);

      await updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Acesso negado. Você não é o organizador deste evento.' });
    });
  });

  // --- Testes para deleteEvent ---
  describe('deleteEvent', () => {
    it('deve deletar um evento com sucesso', async () => {
      const req = createMockReq({
        params: { id: 'event-id-123' },
        user: { id: 'user-id-123', role: 'CLIENT' },
      });

      // Simula que o evento existe e pertence ao usuário
      const existingEvent = { id: 'event-id-123', userId: 'user-id-123' };
      vi.mocked(prisma.event.findUnique).mockResolvedValue(existingEvent as any);
      vi.mocked(prisma.event.delete).mockResolvedValue(existingEvent as any);

      await deleteEvent(req, res);

      expect(prisma.event.delete).toHaveBeenCalledWith({ where: { id: 'event-id-123' } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar erro 403 se o usuário não for o organizador', async () => {
      const req = createMockReq({
        params: { id: 'event-id-123' },
        user: { id: 'outro-user-id', role: 'CLIENT' },
      });

      const existingEvent = { id: 'event-id-123', userId: 'user-id-original' };
      vi.mocked(prisma.event.findUnique).mockResolvedValue(existingEvent as any);

      await deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Acesso negado. Você não é o organizador deste evento.' });
    });
  });
});
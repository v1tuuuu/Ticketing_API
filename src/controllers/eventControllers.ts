import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prisma.js";

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.coerce.date(),
  location: z.string().min(1),
});

const updateEventSchema = createEventSchema.partial();

type EventUpdateData = z.infer<typeof updateEventSchema>;

type AuthenticatedRequest = Request & { user?: { id: string; role: string } };

const handlePrismaError = (error: unknown, res: Response, fallbackMessage: string) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001') {
    return res.status(503).json({
      message: 'Banco de dados indisponível. Aguarde a inicialização e tente novamente.',
    });
  }

  console.error(error);
  return res.status(500).json({ message: fallbackMessage });
};

const handleValidationError = (res: Response, error: z.ZodError) => {
  return res.status(400).json({ errors: error.format() });
};

const getEventId = (id: string | string[] | undefined, res: Response) => {
  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "ID inválido." });
    return null;
  }

  return id;
};

const getAuthenticatedUser = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return null;
  }

  return req.user;
};

const buildUpdateData = (data: EventUpdateData) => {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData['title'] = data.title;
  if (data.description !== undefined) updateData['description'] = data.description ?? null;
  if (data.date !== undefined) updateData['date'] = data.date;
  if (data.location !== undefined) updateData['location'] = data.location;

  return updateData;
};

const findEventById = async (id: string) => {
  return prisma.event.findUnique({
    where: { id },
  });
};

export const createEvent = async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req as AuthenticatedRequest, res);
  if (!user) return;

  const parseResult = createEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    return handleValidationError(res, parseResult.error);
  }

  const { title, description, date, location } = parseResult.data;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description: description ?? null,
        date,
        location,
        organizer: {
          connect: { id: user.id },
        },
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    return handlePrismaError(error, res, "Erro ao criar o evento.");
  }
};

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });

    return res.status(200).json(events);
  } catch (error) {
    return handlePrismaError(error, res, "Erro ao buscar eventos.");
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const id = getEventId(req.params['id'], res);
  if (!id) return;

  try {
    const event = await findEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    return res.status(200).json(event);
  } catch (error) {
    return handlePrismaError(error, res, "Erro ao buscar o evento.");
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req as AuthenticatedRequest, res);
  if (!user) return;

  const id = getEventId(req.params['id'], res);
  if (!id) return;

  const parseResult = updateEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    return handleValidationError(res, parseResult.error);
  }

  try {
    const eventToUpdate = await findEventById(id);
    if (!eventToUpdate) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    if (eventToUpdate.userId !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Acesso negado. Você não é o organizador deste evento." });
    }

    const event = await prisma.event.update({
      where: { id },
      data: buildUpdateData(parseResult.data),
    });

    return res.status(200).json(event);
  } catch (error) {
    return handlePrismaError(error, res, "Erro ao atualizar o evento.");
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req as AuthenticatedRequest, res);
  if (!user) return;

  const id = getEventId(req.params['id'], res);
  if (!id) return;

  try {
    const eventToDelete = await findEventById(id);
    if (!eventToDelete) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    if (eventToDelete.userId !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Acesso negado. Você não é o organizador deste evento." });
    }

    await prisma.event.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    return handlePrismaError(error, res, "Erro ao deletar o evento.");
  }
};

import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import jwt from "jsonwebtoken"; 

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.coerce.date(),
  location: z.string().min(1),
  userId: z.string().uuid(),
});

const updateEventSchema = createEventSchema.partial();

export const createEvent = async (req: Request, res: Response) => {
  const parseResult = createEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }

  const eventData = {
    ...parseResult.data,
    description: parseResult.data.description ?? null,
  };

  const { userId, ...eventDataWithoutUserId } = eventData;

  try {
    const event = await prisma.event.create({
      data: {
        ...eventDataWithoutUserId,
        organizer: {
          connect: { id: userId },
        },
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar o evento." });
  }
};

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar eventos." });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar o evento." });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  const parseResult = updateEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }

  const updateData: Record<string, unknown> = {};
  if (parseResult.data.title !== undefined) updateData.title = parseResult.data.title;
  if (parseResult.data.description !== undefined) updateData.description = parseResult.data.description ?? null;
  if (parseResult.data.date !== undefined) updateData.date = parseResult.data.date;
  if (parseResult.data.location !== undefined) updateData.location = parseResult.data.location;

  try {
    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar o evento." });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  try {
    await prisma.event.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar o evento." });
  }
};

import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/eventControllers.js";
import { registerUser, loginUser } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/middleware.js";
const router = Router();

// Rotas de Eventos
router.post("/events", authMiddleware, createEvent);
router.get("/events", authMiddleware, getEvents);
router.get("/events/:id", authMiddleware, getEventById);
router.put("/events/:id", authMiddleware, updateEvent);
router.delete("/events/:id", authMiddleware, deleteEvent);

// Rotas de Usuários
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);

export default router;

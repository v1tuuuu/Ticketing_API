import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/eventControllers.js";
import { authMiddleware } from "../middlewares/middleware.js";
const router = Router();

router.route("/events")
  .post(authMiddleware, createEvent)
  .get(authMiddleware, getEvents);

router.route("/events/:id")
  .get(authMiddleware, getEventById)
  .put(authMiddleware, updateEvent)
  .delete(authMiddleware, deleteEvent);

export default router;

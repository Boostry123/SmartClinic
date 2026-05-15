import { Router } from "express";
// Controllers
import {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/roomsController.js";
import { authMiddleware } from "../middleware/auth.js";
// Types
import type {
  RoomFilters,
  CreateRoomDTO,
  UpdateRoomDTO,
} from "../types/enums/roomTypes.js";
import type { ActiveStatus } from "../types/enums/commonTypes.js";
// Services
import { emitCacheInvalidation } from "../utils/socketUtils.js";

const RoomRoutes = Router();

// Create Room
RoomRoutes.post("/", authMiddleware, async (req: any, res) => {
  const token = req.token;
  const body: CreateRoomDTO = req.body;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  if (!body.room_number) {
    return res.status(400).json({
      error: "Missing required field: room_number is mandatory.",
    });
  }

  try {
    const { data, error } = await createRoom(token, body);
    if (error) return res.status(400).json({ error });

    emitCacheInvalidation(req.app.get("io"), "rooms");

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Room
RoomRoutes.patch("/", authMiddleware, async (req: any, res) => {
  const token = req.token;
  const body: UpdateRoomDTO = req.body;
  const { id } = body;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  if (!id) {
    return res.status(400).json({ error: "Room ID is required in the body" });
  }

  try {
    const { data, error } = await updateRoom(token, body);
    if (error) return res.status(400).json({ error });

    emitCacheInvalidation(req.app.get("io"), "rooms");

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// Get Rooms
RoomRoutes.get("/", authMiddleware, async (req: any, res) => {
  const token = req.token;

  const filters: RoomFilters = {
    id: req.query.id as string,
    room_number: req.query.room_number as string,
    status: req.query.status as ActiveStatus,
  };

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data, error } = await getRooms(token, filters);
    if (error) return res.status(400).json({ error });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Room
RoomRoutes.delete("/", authMiddleware, async (req: any, res) => {
  const token = req.token;
  const { id } = req.query;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  if (!id) {
    return res
      .status(400)
      .json({ error: "Room ID is required as a query parameter" });
  }

  try {
    const { data, error } = await deleteRoom(token, id as string);
    if (error) return res.status(400).json({ error });

    emitCacheInvalidation(req.app.get("io"), "rooms");

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

export default RoomRoutes;

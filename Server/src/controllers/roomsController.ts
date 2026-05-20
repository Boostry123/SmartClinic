import { getSupabaseClient } from "../config/supaDb.js";
// Services
import { RoomsService } from "../services/roomService.js";
import { getUserDetails } from "../services/auth.js";
// Utils
import { logInfo, logError } from "../utils/logger.js";
// Types
import LogAction from "../types/enums/logActions.js";
import { LogEntityType } from "../types/logs.js";
import type {
  RoomFilters,
  CreateRoomDTO,
  UpdateRoomDTO,
} from "../types/enums/roomTypes.js";

export const createRoom = async (token: string, body: CreateRoomDTO) => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);
    const { data, error } = await RoomsService.createRoom(supabase, body);

    if (error) throw error;

    await logInfo({
      userId,
      action: LogAction.CREATE_ROOM,
      entityType: LogEntityType.ROOM,
      entityId: data?.id,
      metadata: { body },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Creating room failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.CREATE_ROOM_FAILED,
      entityType: LogEntityType.ROOM,
      metadata: { error: errorMessage, body },
    });

    return { data: null, error: errorMessage };
  }
};

export const updateRoom = async (token: string, body: UpdateRoomDTO) => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const { id } = body;
    const supabase = getSupabaseClient(token);
    const { data, error } = await RoomsService.updateRoom(supabase, id, body);

    if (error) throw error;

    await logInfo({
      userId,
      action: LogAction.UPDATE_ROOM,
      entityType: LogEntityType.ROOM,
      entityId: id,
      metadata: { body },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Updating room failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.UPDATE_ROOM_FAILED,
      entityType: LogEntityType.ROOM,
      entityId: body.id,
      metadata: { error: errorMessage, body },
    });

    return { data: null, error: errorMessage };
  }
};

export const getRooms = async (token: string, filters?: RoomFilters) => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);
    const { data, error } = await RoomsService.getRooms(supabase, filters);

    if (error) throw error;

    await logInfo({
      userId,
      action: LogAction.FETCH_ROOMS,
      entityType: LogEntityType.ROOM,
      metadata: { filters },
    });

    return { data };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Fetching rooms failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.FETCH_ROOMS_FAILED,
      entityType: LogEntityType.ROOM,
      metadata: { error: errorMessage, filters },
    });

    return { data: null, error: errorMessage };
  }
};

export const deleteRoom = async (token: string, id: string) => {
  let userId = "unknown";
  try {
    const { data: userData } = await getUserDetails(token);
    userId = userData?.user?.id || "unknown";

    const supabase = getSupabaseClient(token);

    const { error } = await RoomsService.deleteRoom(supabase, id);
    if (error) throw error;

    await logInfo({
      userId,
      action: LogAction.DELETE_ROOM,
      entityType: LogEntityType.ROOM,
      entityId: id,
    });

    return { data: true };
  } catch (err: any) {
    const errorMessage = err?.message ?? "Unknown error";
    console.error(`Deleting room failed: ${errorMessage}`);

    await logError({
      userId,
      action: LogAction.DELETE_ROOM_FAILED,
      entityType: LogEntityType.ROOM,
      entityId: id,
      metadata: { error: errorMessage },
    });

    return { data: null, error: errorMessage };
  }
};

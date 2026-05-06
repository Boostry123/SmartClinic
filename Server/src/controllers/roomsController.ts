import { getSupabaseClient } from "../config/supaDb.js";
// Services
import { RoomsService } from "../services/roomService.js";
// Types
import type {
  RoomFilters,
  CreateRoomDTO,
  UpdateRoomDTO,
} from "../types/enums/roomTypes.js";

export const createRoom = async (token: string, body: CreateRoomDTO) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await RoomsService.createRoom(supabase, body);

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Creating room failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

export const updateRoom = async (token: string, body: UpdateRoomDTO) => {
  try {
    const { id } = body;
    const supabase = getSupabaseClient(token);
    const { data, error } = await RoomsService.updateRoom(supabase, id, body);

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Updating room failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

export const getRooms = async (token: string, filters?: RoomFilters) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await RoomsService.getRooms(supabase, filters);

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.error(`Fetching rooms failed: ${err?.message ?? err}`);
    return { data: null, error: err?.message ?? "Unknown error" };
  }
};

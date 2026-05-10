import type { ActiveStatus } from "./commonTypes.js";

export interface Room {
  id: string;
  room_number: string;
  status: ActiveStatus;
  allowed_treatments: string[]; // Array of treatment IDs
  created_at: string;
  updated_at: string;
}

export interface RoomFilters {
  id?: string;
  room_number?: string;
  status?: ActiveStatus;
}

export type CreateRoomDTO = Omit<Room, "id" | "created_at" | "updated_at">;

export type UpdateRoomDTO = { id: string } & Partial<
  Omit<Room, "id" | "created_at" | "updated_at">
>;

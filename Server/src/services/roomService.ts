// services/roomService.ts
import type {
  RoomFilters,
  CreateRoomDTO,
  UpdateRoomDTO,
} from "../types/enums/roomTypes.js";

export const RoomsService = {
  /**
   * Creates a new room record
   */
  createRoom: (client: any, data: CreateRoomDTO) => {
    return client.from("rooms").insert(data).select().single();
  },

  /**
   * Fetches rooms based on filters
   */
  getRooms: async (client: any, filters?: RoomFilters) => {
    let query = client.from("rooms").select("*");

    if (filters?.id) query = query.eq("id", filters.id);
    if (filters?.room_number)
      query = query.eq("room_number", filters.room_number);
    if (filters?.status) query = query.eq("status", filters.status);

    return query.order("room_number", { ascending: true });
  },

  /**
   * Updates an existing room
   */
  updateRoom: (client: any, id: string, data: Partial<UpdateRoomDTO>) => {
    const { id: _, ...updatePayload } = data;

    return client
      .from("rooms")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();
  },

  /**
   * Delete an existing room
   *
   */
  deleteRoom: (client: any, id: string) => {
    return client.from("rooms").delete().eq("id", id);
  },
};

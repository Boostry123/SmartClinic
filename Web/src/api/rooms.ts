import apiClient from "./axiosClient";
import type {
  Room,
  CreateRoomDTO,
  UpdateRoomDTO,
  RoomFilters,
} from "./types/rooms";

// Get rooms with optional filters
export const getRooms = async (filters?: RoomFilters): Promise<Room[]> => {
  try {
    const response = await apiClient.get<Room[]>("/rooms", {
      params: filters,
    });
    return response.data;
  } catch (err) {
    console.error("getRooms error:", err);
    throw err;
  }
};

// Create a new room
export const createRoom = async (roomData: CreateRoomDTO): Promise<Room> => {
  try {
    const response = await apiClient.post<Room>("/rooms", roomData);
    return response.data;
  } catch (err) {
    console.error("createRoom error:", err);
    throw err;
  }
};

// Update an existing room
export const updateRoom = async (roomData: UpdateRoomDTO): Promise<Room> => {
  try {
    const response = await apiClient.patch<Room>("/rooms", roomData);
    return response.data;
  } catch (err) {
    console.error("updateRoom error:", err);
    throw err;
  }
};

// Delete a room
export const deleteRoom = async (id: string): Promise<boolean> => {
  if (!id) {
    throw new Error("Room ID is required for deletion");
  }
  try {
    const response = await apiClient.delete<boolean>("/rooms", {
      params: { id },
    });
    return response.data;
  } catch (err) {
    console.error("deleteRoom error:", err);
    throw err;
  }
};

import { useQuery, useMutation } from "@tanstack/react-query";
// API
import { getRooms, createRoom, updateRoom, deleteRoom } from "../api/rooms";
// Types
import type {
  Room,
  RoomFilters,
  CreateRoomDTO,
  UpdateRoomDTO,
} from "../api/types/rooms";

/**
 * Hook for fetching rooms with optional filters.
 */
export const useRooms = (filters?: RoomFilters) => {
  return useQuery<Room[], Error>({
    queryKey: ["rooms", filters],
    queryFn: () => getRooms(filters),
    staleTime: Infinity, // Rely on socket-driven invalidation
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook for creating a new room.
 */
export const useCreateRoom = () => {
  return useMutation({
    mutationFn: (data: CreateRoomDTO) => createRoom(data),
  });
};

/**
 * Hook for updating an existing room.
 */
export const useUpdateRoom = () => {
  return useMutation({
    mutationFn: (data: UpdateRoomDTO) => updateRoom(data),
  });
};

/**
 * Hook for deleting a room.
 */
export const useDeleteRoom = () => {
  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
  });
};

export default useRooms;

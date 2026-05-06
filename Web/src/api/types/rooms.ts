export type ActiveStatus = "Active" | "InActive";

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

export interface CreateRoomDTO {
  room_number: string;
  status: ActiveStatus;
  allowed_treatments: string[];
}

export interface UpdateRoomDTO extends Partial<CreateRoomDTO> {
  id: string;
}

import { useState } from "react";
import { AlertTriangle, DoorOpen, Loader, Plus, X } from "lucide-react";
// Store
import { useAuthStore } from "../store/authStore";
// Hooks
import useRooms, { useCreateRoom } from "../hooks/useRooms";
import useTreatments from "../hooks/useTreatments";
// Components
import Card from "../components/Card";
import Hint from "../components/hint";
import EditRoomModal from "../components/modals/EditRoomModal";
// Types
import type { Room } from "../api/types/rooms";

const Rooms = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const { data: rooms, isLoading, isError, error } = useRooms();
  const { data: treatments } = useTreatments({});
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();

  const user = useAuthStore((state) => state.user);
  const userRole = user?.user_metadata?.role;
  const isDoctorOrAdmin = userRole === "doctor" || userRole === "admin";

  const handleToggleTreatment = (id: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) return;

    createRoom(
      {
        room_number: roomNumber.trim(),
        status: "Active",
        allowed_treatments: selectedTreatments,
      },
      {
        onSuccess: () => {
          setRoomNumber("");
          setSelectedTreatments([]);
          setIsFormOpen(false);
        },
      },
    );
  };

  const getTreatmentName = (id: string) =>
    treatments?.find((t) => t.id === id)?.treatment_name ?? id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-8 m-6">
        <AlertTriangle className="text-red-500" size={48} />
        <h2 className="mt-4 text-xl font-semibold text-red-800">
          Error Fetching Rooms
        </h2>
        <p className="mt-2 text-red-600">
          {error?.message || "Failed to load rooms."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Rooms
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full sm:w-auto">
          <Hint text="Click on a room to edit it." />
        </div>
        {isDoctorOrAdmin && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            New Room
          </button>
        )}
      </div>

      {/* New Room Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">New Room</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 1, 2A, 101"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Treatments{" "}
                  <span className="text-gray-400 font-normal">
                    (leave empty = all treatments)
                  </span>
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
                  {treatments?.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTreatments.includes(t.id)}
                        onChange={() => handleToggleTreatment(t.id)}
                        className="rounded text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">
                        {t.treatment_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating && <Loader className="animate-spin" size={14} />}
                  {isCreating ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      {!rooms || rooms.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <DoorOpen className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
          <p className="text-gray-500 mt-1">Start by creating a new room.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              title={
                <div className="flex justify-between items-center w-full">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <DoorOpen className="text-indigo-600" size={24} />
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      room.status === "Active"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
              }
            >
              <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
                Room {room.room_number}
              </h2>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Allowed Treatments
                </p>
                {room.allowed_treatments.length === 0 ? (
                  <p className="text-sm text-indigo-600 font-medium">
                    All treatments
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {room.allowed_treatments.map((id) => (
                      <span
                        key={id}
                        className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100"
                      >
                        {getTreatmentName(id)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Room Modal */}
      {selectedRoom && (
        <EditRoomModal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          room={selectedRoom}
        />
      )}
    </div>
  );
};

export default Rooms;

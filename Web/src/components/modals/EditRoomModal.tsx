import { useState } from "react";
import { X, Loader } from "lucide-react";
import { useUpdateRoom, useDeleteRoom } from "../../hooks/useRooms";
import useTreatments from "../../hooks/useTreatments";
import Button from "../Button";
import type { Room } from "../../api/types/rooms";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

const EditRoomModal = ({ isOpen, onClose, room }: EditRoomModalProps) => {
  const { mutateAsync: updateRoom, isPending } = useUpdateRoom();
  const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: treatments } = useTreatments();

  const [formData, setFormData] = useState({
    room_number: room.room_number,
    status: room.status,
    allowed_treatments: room.allowed_treatments,
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTreatment = (treatmentId: string) => {
    setFormData((prev) => ({
      ...prev,
      allowed_treatments: prev.allowed_treatments.includes(treatmentId)
        ? prev.allowed_treatments.filter((id) => id !== treatmentId)
        : [...prev.allowed_treatments, treatmentId],
    }));
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteRoom(room.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete room:", error);
      alert("Failed to delete room. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRoom({ id: room.id, ...formData });
      onClose();
    } catch (error) {
      console.error("Failed to update room:", error);
      alert("Failed to update room. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Edit Room</h3>
            <p className="text-sm text-gray-500">Room #{room.room_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number
            </label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4361ee] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4361ee] transition-all"
            >
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Treatments
            </label>
            {!treatments || treatments.length === 0 ? (
              <p className="text-sm text-gray-400">No treatments available.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
                {treatments.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.allowed_treatments.includes(t.id)}
                      onChange={() => toggleTreatment(t.id)}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700">
                      {t.treatment_name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              text={confirmDelete ? "Confirm Delete?" : "Delete Room"}
              onClick={handleDelete}
              color="red"
              type="button"
              disabled={isDeleting}
            />
            <div className="flex gap-3">
              <Button
                text="Cancel"
                onClick={() => { onClose(); setConfirmDelete(false); }}
                color="gray"
                type="button"
              />
              <Button
                type="submit"
                text={isPending ? "Saving..." : "Save Changes"}
                color="indigo"
              />
            </div>
          </div>
        </form>

        {isPending && (
          <div className="absolute inset-0 bg-white/60 rounded-xl flex items-center justify-center">
            <Loader size={32} className="animate-spin text-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRoomModal;

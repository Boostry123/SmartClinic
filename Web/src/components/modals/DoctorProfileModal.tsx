import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { DateTime } from "luxon";
//store
import { useAuthStore } from "../../store/authStore";
//hooks
import useDoctors, { useUpdateDoctor } from "../../hooks/useDoctors";
//types
import type { DoctorUpdate } from "../../api/types/doctors";

interface ProfileModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

interface DoctorFormData {
  name: string;
  last_name: string;
  national_id_number: string;
  license_number: string;
  specialization: string;
  career_start_date: string;
  bio: string;
}

const DoctorProfileModal: React.FC<ProfileModalProps> = ({
  isModalOpen,
  onClose,
}) => {
  const doctorId = useAuthStore((state) => state.user?.id);
  const { data: doctorDataArray, isLoading } = useDoctors({
    user_id: doctorId,
  });
  const doctor = doctorDataArray?.[0];
  const { mutate, isPending } = useUpdateDoctor();

  // Helper to format date for input[type="date"]
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const dt = DateTime.fromISO(dateString);
    return dt.isValid ? dt.toISODate() || "" : "";
  };

  // 1. Initialize empty state
  const [formData, setFormData] = useState<DoctorFormData>({
    name: "",
    last_name: "",
    national_id_number: "",
    license_number: "",
    specialization: "",
    career_start_date: "",
    bio: "",
  });

  // 2. Sync state when doctor data arrives or changes
  const [prevDoctorId, setPrevDoctorId] = useState<string | null>(null);

  if (doctor && doctor.id !== prevDoctorId) {
    setPrevDoctorId(doctor.id);
    setFormData({
      name: doctor.users?.name || "",
      last_name: doctor.users?.last_name || "",
      national_id_number: doctor.national_id_number || "",
      license_number: doctor.license_number || "",
      specialization: doctor.specialization || "",
      career_start_date: formatDateForInput(doctor.career_start_date),
      bio: doctor.bio || "",
    });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (!doctor) return;

    // Construct the final structure for your API without using 'any'
    const finalJson: DoctorUpdate = {
      id: doctor.id,
      user_id: doctor.user_id,
    };

    // Only add fields if they have a truthy value (non-empty string)
    if (formData.national_id_number)
      finalJson.national_id_number = formData.national_id_number;
    if (formData.specialization)
      finalJson.specialization = formData.specialization;
    if (formData.license_number)
      finalJson.license_number = formData.license_number;
    if (formData.career_start_date)
      finalJson.career_start_date = formData.career_start_date;
    if (formData.bio) finalJson.bio = formData.bio;

    // Handle nested users object separately
    const usersUpdate: Required<DoctorUpdate>["users"] = {};
    if (formData.name) usersUpdate.name = formData.name;
    if (formData.last_name) usersUpdate.last_name = formData.last_name;

    if (Object.keys(usersUpdate).length > 0) {
      finalJson.users = usersUpdate;
    }

    mutate(finalJson, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header - Indigo-700 */}
        <div className="flex items-center justify-between px-6 py-4 bg-indigo-700 text-white">
          <h2 className="text-xl font-bold">Doctor Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-600 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative p-6 max-h-[75vh] overflow-y-auto">
          {(isLoading || isPending) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <Loader2 className="w-8 h-8 text-indigo-700 animate-spin" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                First Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-700 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Last Name
              </label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-700 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                National ID
              </label>
              <input
                name="national_id_number"
                value={formData.national_id_number}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-700 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                License Number
              </label>
              <input
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-700 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Specialization
              </label>
              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-700 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Career Start Date
              </label>
              <input
                name="career_start_date"
                type="date"
                value={formData.career_start_date}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-700 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-600">Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-700 outline-none resize-none transition-all"
                placeholder="Briefly describe your medical expertise..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 shadow-md active:scale-95 transition-all"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;

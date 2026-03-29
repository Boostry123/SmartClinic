import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { DateTime } from "luxon";
//store
import { useAuthStore } from "../../../store/authStore";
//hooks
import usePatients, { useUpdatePatient } from "../../../hooks/usePatients";
//types
import type { Gender, PatientUpdate } from "../../../api/types/patients";
//components
import Button from "../../Button";

interface ProfileModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  national_id_number: string;
  phone_number: string;
  address: string;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  insurance_provider: string;
  insurance_policy_number: string;
}

const PatientProfileModal: React.FC<ProfileModalProps> = ({
  isModalOpen,
  onClose,
}) => {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: patientDataArray, isLoading } = usePatients({
    user_id: userId,
  });
  const patient = patientDataArray?.[0];
  const { mutate, isPending } = useUpdatePatient();

  const formatDateForInput = (dateString?: string | null) => {
    if (!dateString) return "";
    const dt = DateTime.fromISO(dateString);
    return dt.isValid ? dt.toISODate() || "" : "";
  };

  const [formData, setFormData] = useState<PatientFormData>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "other",
    national_id_number: "",
    phone_number: "",
    address: "",
    blood_type: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    insurance_provider: "",
    insurance_policy_number: "",
  });

  const [prevPatientId, setPrevPatientId] = useState<string | null>(null);

  if (patient && patient.patient_id !== prevPatientId) {
    setPrevPatientId(patient.patient_id);
    setFormData({
      first_name: patient.first_name || "",
      last_name: patient.last_name || "",
      date_of_birth: formatDateForInput(patient.date_of_birth),
      gender: (patient.gender as Gender) || "other",
      national_id_number: patient.national_id_number || "",
      phone_number: patient.phone_number || "",
      address: patient.address || "",
      blood_type: patient.blood_type || "",
      emergency_contact_name: patient.emergency_contact_name || "",
      emergency_contact_phone: patient.emergency_contact_phone || "",
      insurance_provider: patient.insurance_provider || "",
      insurance_policy_number: patient.insurance_policy_number || "",
    });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (!patient) return;
    const updatePayload: PatientUpdate = {
      patient_id: patient.patient_id,
      ...formData,
      date_of_birth: formData.date_of_birth || null,
    };
    mutate(updatePayload, { onSuccess: onClose });
  };

  if (!isModalOpen) return null;

  // Shared input style from your PatientModal
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4361ee] transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header - Matching PatientModal style */}
        <div className="flex justify-between items-center mb-5 border-b pb-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-800">
              Edit Patient Details
            </h3>
            {patient && (
              <p className="text-sm text-gray-500">
                {formData.first_name} {formData.last_name} • ID:{" "}
                {patient.patient_id.slice(0, 8)}...
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative space-y-6">
          {(isLoading || isPending) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <Loader2 className="w-8 h-8 text-[#4361ee] animate-spin" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                National ID Number
              </label>
              <input
                name="national_id_number"
                value={formData.national_id_number}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <select
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Blood Type</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Name
              </label>
              <input
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Provider
              </label>
              <input
                name="insurance_provider"
                value={formData.insurance_provider}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Phone
              </label>
              <input
                name="emergency_contact_phone"
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Policy Number
              </label>
              <input
                name="insurance_policy_number"
                value={formData.insurance_policy_number}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button text="Cancel" onClick={onClose} color="gray" />
            <Button
              text={isPending ? "Saving..." : "Save Changes"}
              onClick={handleUpdate}
              color="indigo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;

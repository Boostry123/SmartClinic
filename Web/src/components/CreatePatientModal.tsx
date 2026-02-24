import { useState } from "react";
import { X } from "lucide-react";
import { createUser } from "../api/users";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CreatePatientFormData = {
  email: string;
  name: string;
  last_name: string;
  national_id_number: string;
  password: string;
  role: "patient";
};

const CreatePatientModal = ({ isOpen, onClose }: CreatePatientModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    last_name: "",
    national_id_number: "",
    password: "",
    role: "patient",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser(formData as CreatePatientFormData);

      setFormData({
        email: "",
        name: "",
        last_name: "",
        national_id_number: "",
        password: "",
        role: "patient",
      });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onClose();
    } catch (error) {
      console.error("Failed to create patient:", error);
      alert("Failed to create patient. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-gray-800">
            Create New Patient
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              National ID
            </label>
            <input
              type="text"
              name="national_id_number"
              value={formData.national_id_number}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#4361ee] rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientModal;

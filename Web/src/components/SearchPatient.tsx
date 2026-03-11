import React, { useState } from "react";
import { X } from "lucide-react";
import Hint from "./hint";

interface SearchFilters {
  national_id_number?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
}

interface MultiSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
  className?: string;
  buttonColor?: "indigo" | "gray" | "emerald";
  onClose?: () => void;
}

const MultiParameterSearch = ({
  onSearch,
  isLoading = false,
  className = "",
  buttonColor = "indigo",
  onClose,
}: MultiSearchProps) => {
  // 1. Initialized as an empty object as requested
  const [filters, setFilters] = useState<SearchFilters>({});

  const colorMap = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    gray: "bg-gray-700 hover:bg-gray-800",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Clean the object: Only send keys that have actual values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value && value.trim() !== "",
      ),
    );

    onSearch(cleanFilters);
    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    setFilters({}); // Reset to empty object
  };

  return (
    <div
      className={`bg-white p-6 border rounded-xl shadow-lg relative ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Advanced Search</h3>
          <Hint text="Leaving the fields empty will bring all patients." />
        </div>

        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              National ID
            </label>
            <input
              name="national_id_number"
              type="text"
              value={filters.national_id_number || ""}
              onChange={handleChange}
              placeholder="e.g. 123456"
              className="border border-gray-200 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Phone Number
            </label>
            <input
              name="phone_number"
              type="text"
              value={filters.phone_number || ""}
              onChange={handleChange}
              placeholder="e.g. +1234567890"
              className="border border-gray-200 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              First Name
            </label>
            <input
              name="first_name" // Match the interface key exactly
              type="text"
              value={filters.first_name || ""}
              onChange={handleChange}
              placeholder="John"
              className="border border-gray-200 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Last Name
            </label>
            <input
              name="last_name"
              type="text"
              value={filters.last_name || ""}
              onChange={handleChange}
              placeholder="Doe"
              className="border border-gray-200 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded font-medium transition-colors"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-2 text-white font-bold rounded shadow-md transition-all active:scale-95 disabled:opacity-50 ${colorMap[buttonColor]}`}
          >
            {isLoading ? "Searching..." : "Search Patients"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiParameterSearch;

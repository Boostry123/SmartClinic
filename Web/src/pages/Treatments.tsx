import { useState } from "react";
import { AlertTriangle, ArrowLeft, FileText, Loader } from "lucide-react";
//Hooks
import useTreatments from "../hooks/useTreatments";
import { useAuthStore } from "../store/authStore";
//Engines
import TreatmentEngine from "../components/TreatmentEngine";
//Types
import type { Treatment } from "../api/types/treatments";
import Hint from "../components/hint";

const Treatments = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Treatment | null>(
    null,
  );
  const { data: treatments, isLoading, isError, error } = useTreatments();

  const user = useAuthStore((state) => state.user);
  const userRole = user?.user_metadata?.role;
  const isDoctorOrAdmin = userRole === "doctor" || userRole === "admin";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertTriangle className="text-red-500" size={48} />
        <h2 className="mt-4 text-xl font-semibold text-red-800">
          Error Fetching Treatments
        </h2>
        <p className="mt-2 text-red-600">
          {error?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  if (selectedTemplate) {
    return (
      <div className="container mx-auto p-4 animate-fade-in">
        <button
          onClick={() => setSelectedTemplate(null)}
          className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
        >
          <ArrowLeft size={16} />
          Back to Templates
        </button>
        <TreatmentEngine template={selectedTemplate} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Treatment Templates
        </h1>
      </div>

      {isDoctorOrAdmin && (
        <div className="flex justify-center mb-8">
          <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg">
            Create New Template [COMING SOON]
          </button>
        </div>
      )}

      <Hint
        text={
          isDoctorOrAdmin
            ? "Select a template to view or edit its structure."
            : "Available treatments at SmartClinic."
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {treatments?.map((template) => (
          <div
            key={template.treatment_name}
            onClick={() => {
              if (isDoctorOrAdmin) {
                setSelectedTemplate(template);
              }
            }}
            className={`group bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 ${
              isDoctorOrAdmin
                ? "cursor-pointer hover:border-indigo-500 hover:shadow-lg transform hover:-translate-y-1"
                : "cursor-default"
            }`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-colors ${
                isDoctorOrAdmin
                  ? "bg-indigo-100 group-hover:bg-indigo-500"
                  : "bg-slate-100"
              }`}
            >
              <FileText
                className={
                  isDoctorOrAdmin
                    ? "text-indigo-600 group-hover:text-white"
                    : "text-slate-400"
                }
                size={24}
              />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              {template.treatment_name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Version {template.template.version}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Treatments;

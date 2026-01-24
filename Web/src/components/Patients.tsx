import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
// Hooks
import usePatients from "../hooks/usePatients";
// Helpers
import { getAge } from "../helpers/Dates";
//Types
import type { patientFilterTypes, Patient } from "../api/types/patients";

const Patients = (filters: patientFilterTypes) => {
  // TanStack Query returns 'isError' and a full 'error' object.
  const { data: patients, isLoading, isError, error } = usePatients(filters);
  const [showIds, setShowIds] = useState(false);

  const columns = useMemo(
    () => [
      {
        header: (
          <div className="flex items-center gap-2">
            <span>Patient ID</span>
            <button
              onClick={() => setShowIds((prev) => !prev)}
              className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
              title={showIds ? "Hide IDs" : "Show IDs"}
              type="button"
            >
              {showIds ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        ),
        accessor: (p: Patient) => (showIds ? p.patient_id : "••••"),
        className: "font-medium font-mono text-gray-600",
      },
      { header: "First Name", accessor: (p: Patient) => p.first_name },
      { header: "Last Name", accessor: (p: Patient) => p.last_name },
      {
        header: "Age",
        accessor: (p: Patient) =>
          p.date_of_birth ? getAge(p.date_of_birth) : "N/A",
      },
      { header: "Gender", accessor: (p: Patient) => p.gender },
      { header: "National ID", accessor: (p: Patient) => p.national_id_number },
      { header: "Phone", accessor: (p: Patient) => p.phone_number },
      { header: "Email", accessor: (p: Patient) => p.users?.email || "-" },
      {
        header: "Address",
        accessor: (p: Patient) => p.address,
        className: "max-w-xs truncate",
      },
      {
        header: "Blood Type",
        accessor: (p: Patient) => (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {p.blood_type}
          </span>
        ),
      },
      {
        header: "Emerg. Contact",
        accessor: (p: Patient) => p.emergency_contact,
      },
      {
        header: "Emerg. Phone",
        accessor: (p: Patient) => p.emergency_contact_phone,
      },
      {
        header: "Insurance Provider",
        accessor: (p: Patient) => p.insurance_provider,
      },
      {
        header: "Insurance Policy #",
        accessor: (p: Patient) => p.insurance_policy_number,
      },
    ],
    [showIds],
  );

  // Loading state remains the same
  if (isLoading)
    return <div className="p-6 text-gray-500">Loading patients...</div>;

  // Error state now uses isError boolean and error object message
  if (isError)
    return (
      <div className="p-6 text-red-500">
        {error?.message || "Failed to load patients"}
      </div>
    );

  // Note: Added optional chaining (patients?) just in case,
  // though TanStack Query ensures data is present if isLoading/isError are false.
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Patients List</h2>
        <span className="text-sm text-gray-500">
          Total Patients:{" "}
          <span className="font-semibold text-gray-800">
            {patients?.length || 0}
          </span>
        </span>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients?.map((patient: Patient) => (
              <tr
                key={patient.patient_id}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, index) => (
                  <td
                    key={`${patient.patient_id}-${index}`}
                    className={`px-6 py-4 text-sm text-gray-500 whitespace-nowrap ${
                      col.className || ""
                    }`}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(patient)
                      : col.accessor}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;

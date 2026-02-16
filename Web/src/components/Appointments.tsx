import { useState, useMemo } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
//Engines
import AppointmentEngine from "./AppointmentEngine";
// Hooks
import useAppointments from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";
//Types
import type {
  Appointment,
  AppointmentFilters,
} from "../api/types/appointments";

const Appointments = (filters: AppointmentFilters) => {
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useAppointments(filters);
  const [showIds, setShowIds] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const { data: treatments } = useTreatments(
    { id: selectedAppointment?.treatment_id || "" },
    !!selectedAppointment
  );

  const handleRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const treatmentTemplate = treatments?.[0] || null;

  const columns = useMemo(
    () => [
      {
        header: (
          <div className="flex items-center gap-2">
            <span>ID</span>
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
        accessor: (a: Appointment) => (showIds ? a.id : "••••"),
        className: "font-medium font-mono text-gray-600",
      },
      {
        header: "Patient",
        accessor: (a: Appointment) =>
          a.patients
            ? `${a.patients.first_name} ${a.patients.last_name}`
            : a.patient_id,
      },
      {
        header: "Doctor",
        accessor: (a: Appointment) =>
          a.doctors
            ? `Dr. ID: ${a.doctor_id} (${a.doctors.specialization})`
            : a.doctor_id,
      },
      {
        header: "Start Time",
        accessor: (a: Appointment) => new Date(a.start_time).toLocaleString(),
      },
      {
        header: "End Time",
        accessor: (a: Appointment) =>
          a.end_time ? new Date(a.end_time).toLocaleString() : "N/A",
      },
      {
        header: "Status",
        accessor: (a: Appointment) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              a.status === "completed"
                ? "bg-green-100 text-green-800"
                : a.status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {a.status}
          </span>
        ),
      },
      {
        header: "Notes",
        accessor: (a: Appointment) => a.notes || "-",
        className: "max-w-xs truncate",
      },
    ],
    [showIds]
  );

  if (isLoading)
    return <div className="p-6 text-gray-500">Loading appointments...</div>;

  if (isError)
    return (
      <div className="p-6 text-red-500">
        {error?.message || "Failed to load appointments"}
      </div>
    );
  if (selectedAppointment && treatmentTemplate) {
    return (
      <div className="container mx-auto p-4 animate-fade-in">
        <button
          onClick={() => setSelectedAppointment(null)}
          className="flex items-center gap-2 mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Appointments
        </button>
        <AppointmentEngine
          appointmentId={selectedAppointment.id}
          template={treatmentTemplate}
          initialData={selectedAppointment.treatment_data}
          onSuccess={() => setSelectedAppointment(null)}
        />
      </div>
    );
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Appointments List</h2>
        <span className="text-sm text-gray-500">
          Total Appointments:{" "}
          <span className="font-semibold text-gray-800">
            {appointments?.length || 0}
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
            {appointments?.map((appointment: Appointment) => (
              <tr
                key={appointment.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleRowClick(appointment)}
              >
                {columns.map((col, index) => (
                  <td
                    key={`${appointment.id}-${index}`}
                    className={`px-6 py-4 text-sm text-gray-500 whitespace-nowrap ${
                      col.className || ""
                    }`}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(appointment)
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

export default Appointments;

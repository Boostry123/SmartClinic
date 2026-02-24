import { useState, useMemo } from "react";
import { ArrowLeft, Eye, EyeOff, Loader } from "lucide-react";
//Engines
import AppointmentEngine from "./AppointmentEngine";
//thirdParty
import { DateTime } from "luxon";
// Hooks
import useAppointments from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";
//Types
import type {
  Appointment,
  AppointmentFilters,
} from "../api/types/appointments";
import { statusStyles } from "../api/types/appointments";
//helpers
import { dateTimeStructure } from "../helpers/Dates";

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
    !!selectedAppointment,
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
            ? `Dr. ${a.doctors.users.name} ${a.doctors.users.last_name}`
            : a.doctor_id,
      },
      {
        header: "Start Time",
        accessor: (a: Appointment) =>
          DateTime.fromISO(a.start_time).toFormat(dateTimeStructure),
      },
      {
        header: "End Time",
        accessor: (a: Appointment) =>
          a.end_time
            ? DateTime.fromISO(a.end_time).toFormat(dateTimeStructure)
            : "N/A",
      },
      {
        header: "Status",
        accessor: (a: Appointment) => (
          <span className={`text-xs font-semibold ${statusStyles[a.status]}`}>
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
    [showIds],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

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

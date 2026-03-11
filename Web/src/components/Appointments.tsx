import { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader,
  Clock,
  Stethoscope,
  FileText,
} from "lucide-react";
import { DateTime } from "luxon";

// Components
import AppointmentEngine from "./AppointmentEngine";
import Card from "./Card";

// Hooks
import useAppointments from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAuthStore } from "../store/authStore";

// Types & Helpers
import type {
  Appointment,
  AppointmentFilters,
} from "../api/types/appointments";
import { statusStyles } from "../api/types/appointments";
import { dateTimeStructure } from "../helpers/Dates";

const Appointments: React.FC<AppointmentFilters> = (props) => {
  const { start_time, end_time, status, patient_id, doctor_id, id } = props;
  const filters = useMemo(
    () => ({ start_time, end_time, status, patient_id, doctor_id, id }),
    [start_time, end_time, status, patient_id, doctor_id, id],
  );

  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useAppointments(filters);
  const { data: treatments } = useTreatments({});

  const [showIds, setShowIds] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const isMobile = useIsMobile();

  const user = useAuthStore((state) => state.user);
  const userRole = user?.user_metadata?.role;
  const isDoctorOrAdmin = userRole === "doctor" || userRole === "admin";

  const handleRowClick = (appointment: Appointment) => {
    if (!isDoctorOrAdmin) return;
    setSelectedAppointment(appointment);
  };

  const treatmentTemplate = useMemo(
    () =>
      treatments?.find((t) => t.id === selectedAppointment?.treatment_id) ||
      null,
    [treatments, selectedAppointment],
  );

  const getPatientName = useCallback(
    (a: Appointment) =>
      a.patients
        ? `${a.patients.first_name} ${a.patients.last_name}`
        : a.patient_id,
    [],
  );

  const getDoctorName = useCallback(
    (a: Appointment) =>
      a.doctors
        ? `Dr. ${a.doctors.users.name} ${a.doctors.users.last_name}`
        : a.doctor_id,
    [],
  );

  const getTreatmentName = useCallback(
    (a: Appointment) =>
      treatments?.find((t) => t.id === a.treatment_id)?.treatment_name || "N/A",
    [treatments],
  );

  const columns = useMemo(
    () => [
      {
        header: (
          <div className="flex items-center gap-2">
            <span>ID</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIds((prev) => !prev);
              }}
              className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500"
              title={showIds ? "Hide IDs" : "Show IDs"}
              type="button"
            >
              {showIds ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        ),
        accessor: (a: Appointment) => (showIds ? a.id : "••••"),
        className: "font-medium font-mono text-slate-500",
      },
      { header: "Patient", accessor: getPatientName },
      { header: "Doctor", accessor: getDoctorName },
      { header: "Treatment", accessor: getTreatmentName },
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
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[a.status]}`}
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
    [showIds, getPatientName, getDoctorName, getTreatmentName],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500 font-medium bg-red-50 rounded-lg">
        {error?.message || "Failed to load appointments"}
      </div>
    );
  }

  if (selectedAppointment && treatmentTemplate) {
    return (
      <div className="container mx-auto p-4 animate-in fade-in duration-300">
        <button
          onClick={() => setSelectedAppointment(null)}
          className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
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
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Appointments
          </h2>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
          Total:{" "}
          <span className="font-bold text-indigo-600">
            {appointments?.length || 0}
          </span>
        </div>
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {appointments?.map((appointment: Appointment) => (
            <div
              key={appointment.id}
              onClick={() => handleRowClick(appointment)}
              className={`${isDoctorOrAdmin ? "cursor-pointer group hover:border-indigo-200" : "cursor-default"} transition-all duration-300`}
            >
              <Card title={getPatientName(appointment)}>
                <div className="mb-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${statusStyles[appointment.status]}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {getTreatmentName(appointment)}
                    </span>
                    <span className="text-slate-400 text-xs mx-1">•</span>
                    <span>{getDoctorName(appointment)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span>
                      {DateTime.fromISO(appointment.start_time).toFormat(
                        dateTimeStructure,
                      )}
                      {appointment.end_time
                        ? ` - ${DateTime.fromISO(appointment.end_time).toFormat("HH:mm")}`
                        : ""}
                    </span>
                  </div>

                  {appointment.notes && (
                    <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                      <FileText
                        size={16}
                        className="text-slate-400 mt-0.5 shrink-0"
                      />
                      <span className="line-clamp-2 italic text-slate-500">
                        {appointment.notes}
                      </span>
                    </div>
                  )}

                  {showIds && (
                    <div className="text-xs font-mono text-slate-400 pt-1">
                      ID: {appointment.id}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
          {!appointments ||
            (appointments.length === 0 && (
              <div>
                <p>No appointments found for the selected date.</p>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {appointments?.map((appointment: Appointment) => (
                  <tr
                    key={appointment.id}
                    className={`${isDoctorOrAdmin ? "hover:bg-slate-50/80 cursor-pointer group" : ""} transition-colors`}
                    onClick={() => handleRowClick(appointment)}
                  >
                    {columns.map((col, index) => (
                      <td
                        key={`${appointment.id}-${index}`}
                        className={`px-6 py-4 text-sm text-slate-600 whitespace-nowrap ${isDoctorOrAdmin ? "group-hover:text-slate-900" : ""} transition-colors ${
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
          {!appointments ||
            (appointments.length === 0 && (
              <div className="">
                <p>No appointments found for the selected date.</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;

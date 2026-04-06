import React, { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Loader,
  Eye,
  EyeOff,
  Clock,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { DateTime } from "luxon";
//components
import AppointmentEngine from "./AppointmentEngine";
import StatusDropdown from "./StatusDropdown";
import Card from "./Card";
//hooks
import useAppointments from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";
import { useIsMobile } from "../hooks/useIsMobile";
//types
import {
  type Appointment,
  type AppointmentFilters,
  statusStyles,
} from "../api/types/appointments";
//helpers
import { dateTimeStructure } from "../helpers/Dates";

const Appointments: React.FC<AppointmentFilters> = (props) => {
  const { start_time, end_time, status, patient_id, doctor_id, id } = props;
  const isMobile = useIsMobile();
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

  const treatmentTemplate = useMemo(
    () =>
      treatments?.find((t) => t.id === selectedAppointment?.treatment_id) ||
      null,
    [treatments, selectedAppointment],
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
      {
        header: "PATIENT",
        accessor: getPatientName,
        className: "font-semibold text-slate-700",
      },
      { header: "DOCTOR", accessor: getDoctorName },
      { header: "TREATMENT", accessor: getTreatmentName },
      {
        header: "START TIME",
        accessor: (a: Appointment) =>
          DateTime.fromISO(a.start_time).toFormat(dateTimeStructure),
      },
      {
        header: "STATUS",
        accessor: (a: Appointment) => (
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[a.status]}`}
            >
              {a.status}
            </span>
            <StatusDropdown appointmentId={a.id} currentStatus={a.status} />
          </div>
        ),
      },
      { header: "NOTES", accessor: (a: Appointment) => a.notes || "-" },
    ],
    [showIds, getPatientName, getDoctorName, getTreatmentName],
  );

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader className="animate-spin text-indigo-500" />
      </div>
    );
  if (isError) return <div className="p-4 text-red-500">{error?.message}</div>;

  if (selectedAppointment && treatmentTemplate) {
    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedAppointment(null)}
          className="flex items-center gap-2 mb-4 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={20} /> Back to List
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
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Appointments
        </h2>

        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 flex items-center gap-2">
          Total:
          <span className="font-bold text-indigo-600">
            {appointments?.length || 0}
          </span>
        </div>
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {appointments?.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => setSelectedAppointment(appointment)}
              className="cursor-pointer group"
            >
              <Card
                title={
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-lg">
                      {getPatientName(appointment)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[appointment.status]}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                }
                className="group-hover:border-indigo-200 transition-all duration-300"
              >
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {getDoctorName(appointment)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-slate-400" />
                    <span>{getTreatmentName(appointment)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span className="font-medium text-indigo-600">
                      {DateTime.fromISO(appointment.start_time).toFormat(
                        dateTimeStructure,
                      )}
                    </span>
                  </div>

                  {appointment.notes && (
                    <div className="pt-2 border-t border-slate-100 text-xs italic text-slate-500 line-clamp-2">
                      {appointment.notes}
                    </div>
                  )}

                  <div
                    className="flex justify-between items-center pt-2 border-t border-slate-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      {showIds && (
                        <span className="text-[10px] font-mono text-slate-400">
                          ID: {appointment.id}
                        </span>
                      )}
                    </div>
                    <StatusDropdown
                      appointmentId={appointment.id}
                      currentStatus={appointment.status}
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
          {(!appointments || appointments.length === 0) && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <p className="text-slate-500">No appointments found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {appointments?.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`px-6 py-4 text-sm text-slate-600 whitespace-nowrap group-hover:text-slate-900 transition-colors ${
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
          {(!appointments || appointments.length === 0) && (
            <div className="p-8 text-center border-t border-slate-100">
              <p className="text-slate-500">No appointments found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;

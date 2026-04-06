import React, { useState, useMemo, useCallback } from "react";
import { ArrowLeft, Loader, Eye, EyeOff } from "lucide-react";
import { DateTime } from "luxon";

import AppointmentEngine from "./AppointmentEngine";
import StatusDropdown from "./StatusDropdown";

import useAppointments from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";

import {
  type Appointment,
  type AppointmentFilters,
  statusStyles,
} from "../api/types/appointments";
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
            ID
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIds(!showIds);
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showIds ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        ),
        accessor: (a: Appointment) => (showIds ? a.id : "••••"),
      },
      { header: "PATIENT", accessor: getPatientName },
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
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
        <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-600 border border-slate-200">
          Total:{" "}
          <span className="text-indigo-600 font-bold">
            {appointments?.length || 0}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {appointments?.map((appointment) => (
              <tr
                key={appointment.id}
                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
                {columns.map((col, i) => (
                  <td
                    key={i}
                    className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap"
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

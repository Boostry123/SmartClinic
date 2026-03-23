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

import AppointmentEngine from "./AppointmentEngine";
import Card from "./Card";
import StatusDropdown from "./StatusDropdown";

import useAppointments from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";
import { useIsMobile } from "../hooks/useIsMobile";
import { useUpdateAppointmentStatus } from "../hooks/useUpdateAppointmentStatus";

import {
  type Appointment,
  type AppointmentFilters,
  type AppointmentStatus,
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
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  const [showIds, setShowIds] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const isMobile = useIsMobile();

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
        header: "ID",
        accessor: (a: Appointment) => (showIds ? a.id : "••••"),
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
        header: "Status",
        accessor: (a: Appointment) => (
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[a.status]}`}
            >
              {a.status}
            </span>
            <StatusDropdown
              currentStatus={a.status}
              onStatusChange={(newStatus) =>
                updateStatus({ id: a.id, status: newStatus })
              }
            />
          </div>
        ),
      },
    ],
    [showIds, getPatientName, getDoctorName, getTreatmentName, updateStatus],
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase"
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
                className="hover:bg-slate-50/80 cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 text-sm text-slate-600">
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

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Users, Activity } from "lucide-react";
import { DateTime } from "luxon";
import Card from "./Card";
import useAppointments from "../hooks/useAppointments";
import { statusStyles, AppointmentStatusEnum } from "../api/types/appointments";

interface DashboardQuickActionsProps {
  startOfDay: string;
  endOfDay: string;
  doctorId?: string;
  isDoctor: boolean;
}

const ACTIONS = [
  { label: "New Appointment", icon: CalendarPlus, path: "/appointments" },
  { label: "Patients", icon: Users, path: "/patients" },
  { label: "Treatments", icon: Activity, path: "/treatments" },
];

const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  startOfDay,
  endOfDay,
  doctorId,
  isDoctor,
}) => {
  const navigate = useNavigate();

  const filters = useMemo(
    () => ({
      start_time: startOfDay,
      end_time: endOfDay,
      ...(isDoctor && doctorId ? { doctor_id: doctorId } : {}),
    }),
    [startOfDay, endOfDay, isDoctor, doctorId],
  );

  const { data: appointments, isLoading } = useAppointments(filters);

  const nextAppointment = useMemo(() => {
    if (!appointments) return null;
    const now = DateTime.now().toISO() ?? "";
    return (
      appointments
        .filter(
          (a) =>
            a.status !== AppointmentStatusEnum.CANCELLED &&
            a.status !== AppointmentStatusEnum.COMPLETED &&
            a.start_time >= now,
        )
        .sort((a, b) => a.start_time.localeCompare(b.start_time))[0] ?? null
    );
  }, [appointments]);

  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      {/* Quick Actions */}
      <Card>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="space-y-2">
          {ACTIONS.map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100"
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Up Next */}
      <Card>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Up Next
        </h2>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
          </div>
        ) : nextAppointment ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              {nextAppointment.patients
                ? `${nextAppointment.patients.first_name} ${nextAppointment.patients.last_name}`
                : "Patient"}
            </p>
            <p className="text-xs text-slate-500">
              {DateTime.fromISO(nextAppointment.start_time).toFormat("HH:mm")}
              {" – "}
              {DateTime.fromISO(nextAppointment.end_time).toFormat("HH:mm")}
            </p>
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[nextAppointment.status]}`}
            >
              {nextAppointment.status.replace("_", " ")}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            No more appointments today
          </p>
        )}
      </Card>
    </div>
  );
};

export default DashboardQuickActions;

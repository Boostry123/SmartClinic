import React, { useMemo } from "react";
import { DateTime } from "luxon";
import Card from "./Card";
import useAppointments from "../hooks/useAppointments";
import {
  statusStyles,
  AppointmentStatusEnum,
  type AppointmentStatus,
} from "../api/types/appointments";

interface DashboardStatsSidebarProps {
  startOfDay: string;
  endOfDay: string;
  doctorId?: string;
  isDoctor: boolean;
}

const STATUS_ORDER: AppointmentStatus[] = [
  AppointmentStatusEnum.SCHEDULED,
  AppointmentStatusEnum.CONFIRMED,
  AppointmentStatusEnum.CHECKED_IN,
  AppointmentStatusEnum.COMPLETED,
  AppointmentStatusEnum.CANCELLED,
];

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  completed: "Completed",
  cancelled: "Cancelled",
};

const DashboardStatsSidebar: React.FC<DashboardStatsSidebarProps> = ({
  startOfDay,
  endOfDay,
  doctorId,
  isDoctor,
}) => {
  const filters = useMemo(
    () => ({
      start_time: startOfDay,
      end_time: endOfDay,
      ...(isDoctor && doctorId ? { doctor_id: doctorId } : {}),
    }),
    [startOfDay, endOfDay, isDoctor, doctorId],
  );

  const { data: appointments, isLoading } = useAppointments(filters);

  const statusCounts = useMemo(() => {
    if (!appointments) return {} as Record<AppointmentStatus, number>;
    return appointments.reduce<Record<string, number>>((acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [appointments]);

  const today = DateTime.now().toFormat("dd MMM yyyy");

  return (
    <div className="lg:sticky lg:top-20">
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Today's Summary
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{today}</p>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {STATUS_ORDER.map((s) => (
              <div
                key={s}
                className="h-7 rounded-full bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {STATUS_ORDER.map((status) => (
              <div
                key={status}
                className="flex items-center justify-between gap-2"
              >
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
                >
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-sm font-bold text-slate-700 tabular-nums">
                  {statusCounts[status] ?? 0}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total</span>
          <span className="text-sm font-bold text-indigo-600">
            {appointments?.length ?? 0}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStatsSidebar;

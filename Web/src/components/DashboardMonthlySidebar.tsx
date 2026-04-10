import React, { useMemo } from "react";
import { DateTime } from "luxon";
import Card from "./Card";
import useAppointments from "../hooks/useAppointments";
import {
  AppointmentStatusEnum,
  type AppointmentStatus,
} from "../api/types/appointments";

interface DashboardMonthlySidebarProps {
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

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: "#93c5fd",
  confirmed: "#c4b5fd",
  checked_in: "#fdba74",
  completed: "#86efac",
  cancelled: "#fca5a5",
};

const R = 42;
const CX = 50;
const CY = 50;
const CIRCUMFERENCE = 2 * Math.PI * R;

const DashboardMonthlySidebar: React.FC<DashboardMonthlySidebarProps> = ({
  doctorId,
  isDoctor,
}) => {
  const { startOfMonth, endOfMonth, monthLabel } = useMemo(
    () => ({
      startOfMonth: DateTime.now().startOf("month").toISO() ?? "",
      endOfMonth: DateTime.now().endOf("month").toISO() ?? "",
      monthLabel: DateTime.now().toFormat("MMMM yyyy"),
    }),
    [],
  );

  const filters = useMemo(
    () => ({
      start_time: startOfMonth,
      end_time: endOfMonth,
      ...(isDoctor && doctorId ? { doctor_id: doctorId } : {}),
    }),
    [startOfMonth, endOfMonth, isDoctor, doctorId],
  );

  const { data: appointments, isLoading } = useAppointments(filters);

  const { statusCounts, total } = useMemo(() => {
    if (!appointments)
      return { statusCounts: {} as Record<string, number>, total: 0 };
    const counts = appointments.reduce<Record<string, number>>((acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      statusCounts: counts,
      total: Object.values(counts).reduce((a, b) => a + b, 0),
    };
  }, [appointments]);

  const segments = useMemo(() => {
    if (total === 0) return [];
    const GAP = 2;
    let accumulated = 0;
    return STATUS_ORDER.filter((status) => (statusCounts[status] ?? 0) > 0).map(
      (status) => {
        const count = statusCounts[status] ?? 0;
        const fullSlice = (count / total) * CIRCUMFERENCE;
        const dashArray = fullSlice - GAP;
        const dashOffset = -accumulated;
        accumulated += fullSlice;
        return { status, dashArray, dashOffset };
      },
    );
  }, [statusCounts, total]);

  return (
    <div className="lg:sticky lg:top-20">
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-700">This Month</h2>
          <p className="text-xs text-slate-400 mt-0.5">{monthLabel}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-36 h-36 rounded-full bg-slate-100 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Donut Chart */}
            <div className="relative flex justify-center">
              <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
                {total === 0 ? (
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                  />
                ) : (
                  segments.map(({ status, dashArray, dashOffset }) => (
                    <circle
                      key={status}
                      cx={CX}
                      cy={CY}
                      r={R}
                      fill="none"
                      stroke={STATUS_COLORS[status]}
                      strokeWidth="12"
                      strokeDasharray={`${dashArray} ${CIRCUMFERENCE - dashArray}`}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="butt"
                    />
                  ))
                )}
              </svg>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-700">
                  {total}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  total
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-1.5">
              {STATUS_ORDER.map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: STATUS_COLORS[status] }}
                    />
                    <span className="text-xs text-slate-600">
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">
                    {statusCounts[status] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default DashboardMonthlySidebar;

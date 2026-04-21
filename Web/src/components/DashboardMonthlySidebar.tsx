import React, { useMemo } from "react";
import { DateTime } from "luxon";
import { PieChart } from "react-minimal-pie-chart";
import Card from "./Card";
import useAppointments from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";

interface DashboardMonthlySidebarProps {
  doctorId?: string;
  isDoctor: boolean;
}

const CHART_COLORS = [
  "#93c5fd",
  "#c4b5fd",
  "#fdba74",
  "#86efac",
  "#fca5a5",
  "#6ee7b7",
  "#fde68a",
  "#a5b4fc",
  "#f9a8d4",
  "#67e8f9",
];

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

  const { data: appointments, isLoading: isLoadingAppts } =
    useAppointments(filters);
  const { data: treatments, isLoading: isLoadingTreats } = useTreatments({});

  const { chartData, total } = useMemo(() => {
    if (!appointments || !treatments) return { chartData: [], total: 0 };

    const treatmentMap = new Map(
      treatments.map((t) => [t.id, t.treatment_name]),
    );

    const counts: Record<string, number> = {};
    appointments.forEach((appt) => {
      const name =
        treatmentMap.get(appt.treatment_id ?? "") ?? "General Treatment";
      counts[name] = (counts[name] ?? 0) + 1;
    });

    const entries = Object.entries(counts);
    const totalCount = entries.reduce((sum, [, count]) => sum + count, 0);

    const data = entries.map(([name, count], index) => ({
      title: name,
      value: count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    return { chartData: data, total: totalCount };
  }, [appointments, treatments]);

  const isLoading = isLoadingAppts || isLoadingTreats;

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
            <div className="relative flex justify-center">
              {total === 0 ? (
                <div className="w-36 h-36 rounded-full border-[12px] border-slate-100" />
              ) : (
                <PieChart
                  data={chartData}
                  lineWidth={35}
                  className="w-36 h-36"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-700">
                  {total}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  total
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              {chartData.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-600">{item.title}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">
                    {item.value}
                  </span>
                </div>
              ))}
              {chartData.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center">
                  No appointments this month
                </p>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default DashboardMonthlySidebar;

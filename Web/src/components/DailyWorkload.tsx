import React, { useMemo } from "react";
import { useAppointmentsForDoctor } from "../hooks/useAppointments";
import useTreatments from "../hooks/useTreatments";

interface DailyWorkloadProps {
  doctorId: string;
}

const DailyWorkload: React.FC<DailyWorkloadProps> = ({ doctorId }) => {
  const today = new Date().toISOString().split("T")[0];

  const { data: appointments, isLoading: isLoadingAppts } =
    useAppointmentsForDoctor({
      doctor_id: doctorId,
      start_time: today,
    });

  const { data: treatments, isLoading: isLoadingTreats } = useTreatments(
    undefined,
    true,
  );

  const workloadData = useMemo(() => {
    if (!appointments || !treatments) return [];

    const treatmentMap = new Map(
      treatments.map((t) => [t.id, t.treatment_name]),
    );

    const counts: Record<string, number> = {};

    appointments.forEach((appt) => {
      const name =
        treatmentMap.get(appt.treatment_id || "") || "General Treatment";
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [appointments, treatments]);

  if (isLoadingAppts || isLoadingTreats) {
    return <div className="p-4 text-gray-500 font-medium">Loading data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="border-b pb-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Daily Workload Breakdown
        </h3>
        <p className="text-sm text-gray-500 italic">Today's metrics</p>
      </div>

      <div className="space-y-4">
        {workloadData.length > 0 ? (
          workloadData.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center group"
            >
              <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                  {item.count} {item.count === 1 ? "Appt" : "Appts"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm italic">
              No appointments scheduled for today
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyWorkload;

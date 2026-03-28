import React, { useMemo } from "react";
import { Loader } from "lucide-react";
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

  const { data: treatments, isLoading: isLoadingTreats } = useTreatments({});

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
    return (
      <div className="flex justify-center items-center h-12">
        <Loader className="animate-spin text-indigo-500" size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
      {workloadData.length > 0 ? (
        workloadData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 font-medium">
            <span>{item.name}:</span>
            <span className="text-indigo-600 font-bold">{item.count}</span>
          </div>
        ))
      ) : (
        <span className="text-slate-400 italic">No appointments today</span>
      )}
    </div>
  );
};

export default DailyWorkload;

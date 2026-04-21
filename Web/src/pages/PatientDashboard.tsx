import React, { useMemo } from "react";
import { Loader } from "lucide-react";
import Card from "../components/Card";
import Appointments from "../components/Appointments";
import LiveClock from "../components/LiveClock";
import usePatients from "../hooks/usePatients";
import type { UserProfile } from "../types/auth";

const PatientDashboard: React.FC = () => {
  const userData: UserProfile | null = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const { data: patientsData, isLoading } = usePatients({
    user_id: userData?.id ?? "",
  });

  const patientId = patientsData?.[0]?.patient_id;
  const patientName = patientsData?.[0]
    ? `${patientsData[0].first_name} ${patientsData[0].last_name}`
    : "";

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen font-sans">
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-gray-100 relative flex items-center justify-between bg-white">
          <div className="bg-indigo-50 px-4 py-2 rounded-xl">
            <LiveClock />
          </div>
          {patientName && (
            <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
              <span className="text-xs text-indigo-400 uppercase tracking-widest">
                Welcome back
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {patientName}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader className="animate-spin text-indigo-600" size={40} />
              <span className="text-indigo-600/60 font-medium animate-pulse">
                Loading your appointments...
              </span>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Appointments patient_id={patientId} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;

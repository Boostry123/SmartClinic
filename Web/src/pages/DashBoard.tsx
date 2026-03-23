import React, { useMemo } from "react";
import { Loader } from "lucide-react";
import { DateTime } from "luxon";
// Components
import Card from "../components/Card";
import Appointments from "../components/Appointments";
import LiveClock from "../components/LiveClock";
import DailyWorkload from "../components/DailyWorkload";
// Types
import { ClinicRoleEnum, type ClinicRole } from "../types/auth";
// Hooks
import useDoctors from "../hooks/useDoctors";

// Define a local interface for the user metadata
interface UserData {
  id: string;
  user_metadata: {
    role: ClinicRole;
  };
}

const DashBoard: React.FC = () => {
  // Memoize date calculations to prevent unnecessary re-renders
  const { startOfDay, endOfDay } = useMemo(
    () => ({
      startOfDay: DateTime.now().startOf("day").toISO() ?? "",
      endOfDay: DateTime.now().endOf("day").toISO() ?? "",
    }),
    [],
  );

  // Safely parse user data from localStorage
  const userData: UserData | null = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse user data", e);
      return null;
    }
  }, []);

  const isDoctor = userData?.user_metadata.role === ClinicRoleEnum.doctor;
  const userId = isDoctor ? userData?.id : undefined;

  // Fetch doctor details based on user ID
  const { data: doctorsData, isLoading } = useDoctors({
    user_id: userId || "",
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <Card className="max-w-7xl mx-auto border-none shadow-sm overflow-hidden bg-white">
        {/* Header section with Live Clock */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="bg-indigo-50 px-4 py-2 rounded-xl">
            <LiveClock />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader className="animate-spin text-indigo-600" size={40} />
              <span className="text-indigo-600/60 font-medium animate-pulse">
                Syncing calendar...
              </span>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
              {/* Mission #64: Daily Workload Analytics Section */}
              {isDoctor && doctorsData?.[0]?.id && (
                <div className="max-w-md">
                  <DailyWorkload doctorId={doctorsData[0].id} />
                </div>
              )}

              {/* Main Appointments Table Section */}
              <div className="border-t pt-6">
                <Appointments
                  start_time={startOfDay}
                  end_time={endOfDay}
                  doctor_id={doctorsData?.[0]?.id}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashBoard;

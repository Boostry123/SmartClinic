import React, { useMemo } from "react";
import { Loader } from "lucide-react";
import { DateTime } from "luxon";
// Components
import Card from "../components/Card";
import Appointments from "../components/Appointments";
import LiveClock from "../components/LiveClock";

//types
import { ClinicRoleEnum, type UserProfile } from "../types/auth";
//hooks
import useDoctors from "../hooks/useDoctors";
import DailyWorkload from "../components/DailyWorkload";

import DashboardStatsSidebar from "../components/DashboardStatsSidebar";
import DashboardMonthlySidebar from "../components/DashboardMonthlySidebar";

const DashBoard: React.FC = () => {
  // Memoize date calculations to prevent unnecessary re-renders
  const { startOfDay, endOfDay } = useMemo(
    () => ({
      startOfDay: DateTime.now().startOf("day").toISO() ?? "",
      endOfDay: DateTime.now().endOf("day").toISO() ?? "",
    }),
    [],
  );

  // Safely parse user data
  const userData: UserProfile | null = useMemo(() => {
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

  const isAdminOrSecretary =
    userData?.user_metadata.role === ClinicRoleEnum.admin ||
    userData?.user_metadata.role === ClinicRoleEnum.secretary;

  const { data: doctorsData, isLoading } = useDoctors({
    user_id: userId || "",
  });

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-4 lg:gap-6 items-start">
        {/* Left sidebar */}
        <DashboardStatsSidebar
          startOfDay={startOfDay}
          endOfDay={endOfDay}
          doctorId={isDoctor ? doctorsData?.[0]?.id : undefined}
          isDoctor={isDoctor}
        />

        {/* Center — existing content unchanged */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
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
                {/* Daily Workload Analytics Section */}
                {isDoctor && doctorsData?.[0]?.id ? (
                  <div className="w-full">
                    <DailyWorkload doctorId={doctorsData[0].id} />
                  </div>
                ) : (
                  isAdminOrSecretary && (
                    <div className="w-full">
                      <DailyWorkload doctorId="" />
                    </div>
                  )
                )}

                {isDoctor ? (
                  <div className="border-t pt-6">
                    <Appointments
                      start_time={startOfDay}
                      end_time={endOfDay}
                      doctor_id={doctorsData?.[0]?.id}
                    />
                  </div>
                ) : (
                  <div className="border-t pt-6">
                    <Appointments start_time={startOfDay} end_time={endOfDay} />
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Right sidebar */}
        <DashboardMonthlySidebar
          doctorId={isDoctor ? doctorsData?.[0]?.id : undefined}
          isDoctor={isDoctor}
        />
      </div>
    </div>
  );
};

export default DashBoard;

import React, { useMemo } from "react";
import { DateTime } from "luxon";
import Card from "../components/Card";
import Appointments from "../components/Appointments";
import { ClinicRoleEnum, type ClinicRole } from "../types/auth";
import useDoctors from "../hooks/useDoctors";

// Define a local interface for the user metadata if not already global
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

  // Safely parse user data
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

  const { data: doctorsData } = useDoctors({ user_id: userId || "" });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card title="Doctor Dashboard" className="max-w-7xl mx-auto">
        <div className="w-full mt-4">
          <h3 className="text-lg font-medium mb-4">Today's Appointments</h3>

          <Appointments
            start_time={startOfDay}
            end_time={endOfDay}
            doctor_id={doctorsData?.[0]?.id}
          />
        </div>
      </Card>
    </div>
  );
};

export default DashBoard;

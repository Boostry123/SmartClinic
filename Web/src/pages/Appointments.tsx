import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DateTime } from "luxon";
import DatePicker from "../components/Datepicker";
import Appointments from "../components/Appointments";
import CreateAppointmentModal from "../components/modals/CreateAppointmentModal";
import Button from "../components/Button";
import { useAuthStore } from "../store/authStore";

const AppointmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //default to showing appointments for today
  const [startDate, setStartDate] = useState(DateTime.now().toISODate() || "");
  const [endDate, setEndDate] = useState(
    DateTime.now().plus({ days: 1 }).toISODate() || "",
  );
  const [showPicker, setShowPicker] = useState(false);
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patient_id") || undefined;

  const user = useAuthStore((state) => state.user);
  const userRole = user?.user_metadata?.role;
  const isDoctorOrAdmin = userRole === "doctor" || userRole === "admin";

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header Section: Filter (Left) & Actions (Right) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        {!patientId && (
          <div className="w-full sm:w-auto">
            <DatePicker
              start_date={startDate}
              isOpen={showPicker}
              onToggle={() => setShowPicker((prev) => !prev)}
              onClose={() => setShowPicker(false)}
              onDateChange={(date) => {
                setStartDate(date);
                setEndDate(
                  DateTime.fromISO(date).plus({ days: 1 }).toISODate() || "",
                );
                setShowPicker(false);
              }}
            />
          </div>
        )}

        {isDoctorOrAdmin && !patientId && (
          <Button
            text={"New Appointment"}
            onClick={() => setIsModalOpen(true)}
          />
        )}
      </div>

      {/* Main Content */}
      {patientId ? (
        <Appointments patient_id={patientId} />
      ) : (
        <Appointments start_time={startDate} end_time={endDate} />
      )}

      {/* Modals */}
      {!patientId && (
        <CreateAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;

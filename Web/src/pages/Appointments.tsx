import { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "../components/Datepicker";
import Appointments from "../components/Appointments";
import CreateAppointmentModal from "../components/modals/CreateAppointmentModal";
import Button from "../components/Button";

const AppointmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //default to showing appointments for today
  const [startDate, setStartDate] = useState(DateTime.now().toISODate() || "");
  const [endDate, setEndDate] = useState(
    DateTime.now().plus({ days: 1 }).toISODate() || "",
  );
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header Section: Filter (Left) & Actions (Right) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        {/* Date Filter Wrapper */}
        <div className="w-full sm:w-auto">
          <DatePicker
            start_date={startDate}
            isOpen={showPicker}
            onToggle={() => setShowPicker((prev) => !prev)}
            onClose={() => setShowPicker(false)}
            onDateChange={(date) => {
              setStartDate(date);
              // Optionally update endDate to the next day to maintain a 1-day window
              setEndDate(
                DateTime.fromISO(date).plus({ days: 1 }).toISODate() || "",
              );
              setShowPicker(false);
            }}
          />
        </div>

        {/* Primary Action Button */}
        <Button text={"New Appointment"} onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Main Content */}
      <Appointments start_time={startDate} end_time={endDate} />

      {/* Modals */}
      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AppointmentsPage;

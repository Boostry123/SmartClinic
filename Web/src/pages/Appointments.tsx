import { useState } from "react";
import Appointments from "../components/Appointments";
import CreateAppointmentModal from "../components/modals/CreateAppointmentModal";

const AppointmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-semibold py-2 px-4 rounded"
        >
          New Appointment
        </button>
      </div>
      <Appointments />
      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AppointmentsPage;

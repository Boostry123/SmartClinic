/*
    this component will serve as the main dashboard page
    we do not write code directly here, instead we will create sub-components
    for different sections of the dashboard and import them here.
  */

import Footer from "../components/Footer";
import Card from "../components/Card";
import TodayAppointments from "../components/TodayAppointments";

const DashBoard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 bg-gray-50">
        <Card title="Doctor Dashboard" className="max-w-6xl mx-auto">
          <div className="w-full mt-4">
            <h3 className="text-lg font-medium mb-4">Today's Appointments</h3>

            <TodayAppointments />
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default DashBoard;

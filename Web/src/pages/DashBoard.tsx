/*
  This component will serve as the main dashboard page.
  We do not write code directly here, instead we will create sub-components
  for different sections of the dashboard and import them here.
*/
import Card from "../components/Card";
import TodayAppointments from "../components/TodayAppointments";

const DashBoard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card title="Doctor Dashboard" className="max-w-6xl mx-auto">
        <div className="w-full mt-4">
          <h3 className="text-lg font-medium mb-4">Today's Appointments</h3>
          <TodayAppointments />
        </div>
      </Card>
    </div>
  );
};

export default DashBoard;

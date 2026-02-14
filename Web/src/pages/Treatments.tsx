import { getAppointments } from "../api/appointments";
const Treatments = () => {
  const appointments = getAppointments();
  console.log(appointments);
  return <div></div>;
};

export default Treatments;

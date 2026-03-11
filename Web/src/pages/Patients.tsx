import { DateTime } from "luxon";
import { useMemo } from "react";
//hooks
import useAppointments from "../hooks/useAppointments";
//components
import Patients from "../components/Patients";
//types
import type { patientByIdsFilterTypes } from "../api/types/patients";

const PatientsPage = () => {
  const startDate = useMemo(() => DateTime.now().toISODate() || "", []);
  const endDate = useMemo(
    () => DateTime.now().plus({ days: 1 }).toISODate() || "",
    [],
  );

  const { data: appointments, isLoading } = useAppointments({
    start_time: startDate,
    end_time: endDate,
  });

  // 1. Memoize the ID array
  const todayPatientIds = useMemo(() => {
    return appointments?.map((a) => a.patient_id) || [];
  }, [appointments]);

  // 2. Memoize the filter object
  const todayPatientIdsFilter: patientByIdsFilterTypes = useMemo(
    () => ({
      patient_id: todayPatientIds,
    }),
    [todayPatientIds],
  );

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return <Patients filters={todayPatientIdsFilter} />;
};
export default PatientsPage;

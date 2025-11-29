/*
    this component will hold a list of patients,
    the component fetches all patients related to the logged-in doctor
*/
import { useEffect, useState } from "react";
import { getPatients } from "../api/getPatients";
import type { Patient } from "../api/getPatients";
const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const data = await getPatients();
      setPatients(data);
    };

    fetchPatients();
  }, []); // empty deps → runs only once

  return (
    <div>
      {patients.map((patient) => (
        <div key={patient.id}>
          <p>Name: {patient.name}</p>
          <p>Role: {patient.role}</p>
          <p>Created At: {new Date(patient.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Patients;

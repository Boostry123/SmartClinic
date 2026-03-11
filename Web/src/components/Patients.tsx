import { useState, useMemo, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Loader,
  Phone,
  Mail,
  MapPin,
  Shield,
  User,
} from "lucide-react";
// Hooks
import { usePatientsByIds } from "../hooks/usePatients";
import { useIsMobile } from "../hooks/useIsMobile";
// Helpers
import { getAge } from "../helpers/Dates";
//Types
import type { Patient, patientByIdsFilterTypes } from "../api/types/patients";
// Components
import CreatePatientModal from "./modals/CreatePatientModal";
import PatientModal from "./modals/PatientModal";
import Hint from "./hint";
import Button from "./Button";
import Card from "./Card";
import MultiParameterSearch from "./SearchPatient";
//APIs
import { getPatients } from "../api/patients";

interface PatientsProps {
  filters: patientByIdsFilterTypes;
}
interface handleSearchProps {
  first_name?: string;
  last_name?: string;
  national_id_number?: string;
  phone_number?: string;
}

const Patients = ({ filters }: PatientsProps) => {
  const {
    data: initialPatients,
    isLoading,
    isError,
    error,
  } = usePatientsByIds(filters);

  const [patients, setPatients] = useState<Patient[] | undefined>(
    initialPatients,
  );
  const [showIds, setShowIds] = useState(false);
  const isMobile = useIsMobile();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setPatients(initialPatients);
  }, [initialPatients]);

  const handleSearch = async (filters: handleSearchProps) => {
    const patients = await getPatients(filters);
    setPatients(patients);
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <div className="flex items-center gap-2">
            <span>ID</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIds((prev) => !prev);
              }}
              className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500"
              title={showIds ? "Hide IDs" : "Show IDs"}
              type="button"
            >
              {showIds ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        ),
        accessor: (p: Patient) => (showIds ? p.patient_id : "••••"),
        className: "font-medium font-mono text-slate-500",
      },
      {
        header: "Name",
        accessor: (p: Patient) => `${p.first_name} ${p.last_name}`,
        className: "font-semibold text-slate-700",
      },
      {
        header: "Age/Gender",
        accessor: (p: Patient) => (
          <div className="flex items-center gap-2">
            <span>{p.date_of_birth ? getAge(p.date_of_birth) : "N/A"}</span>
            <span className="text-slate-300">•</span>
            <span className="capitalize">{p.gender}</span>
          </div>
        ),
      },
      { header: "National ID", accessor: (p: Patient) => p.national_id_number },
      {
        header: "Contact",
        accessor: (p: Patient) => (
          <div className="flex flex-col text-xs">
            <span className="flex items-center gap-1">
              <Phone size={12} className="text-slate-400" /> {p.phone_number}
            </span>
            {p.users?.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} className="text-slate-400" /> {p.users.email}
              </span>
            )}
          </div>
        ),
      },
      {
        header: "Blood Type",
        accessor: (p: Patient) => (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
            {p.blood_type}
          </span>
        ),
      },
      {
        header: "Insurance",
        accessor: (p: Patient) => (
          <div className="flex flex-col text-xs">
            <span className="font-medium text-slate-700 truncate max-w-[100px]">
              {p.insurance_provider}
            </span>
            <span className="text-slate-400">#{p.insurance_policy_number}</span>
          </div>
        ),
      },
    ],
    [showIds],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500 font-medium bg-red-50 rounded-lg">
        {error?.message || "Failed to load patients"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex justify-end items-center gap-3 mb-6">
        {/* Search Container */}
        <div className="flex items-center">
          {!searchOpen ? (
            <Button
              text="Search Patient"
              onClick={() => setSearchOpen(true)}
              color="indigo"
            />
          ) : (
            /* The Floating "Pop-over" Search */
            <div
              className={`absolute ${isMobile ? "right-10 left-10 top-10" : "right-20 top-20"} z-50 bg-white p-2 rounded-xl shadow-2xl border border-slate-200`}
            >
              <MultiParameterSearch
                onSearch={handleSearch}
                onClose={() => setSearchOpen(false)}
                className=""
              />
            </div>
          )}
        </div>

        <Button text="New Patient" onClick={() => setIsCreateModalOpen(true)} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Patients
          </h2>
          <Hint text="Initially shows patients with appointments today." />
        </div>

        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 flex items-center gap-2">
          Total:
          <span className="font-bold text-indigo-600">
            {patients?.length || 0}
          </span>
        </div>
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {patients?.map((patient: Patient) => (
            <div
              key={patient.patient_id}
              onClick={() => handlePatientClick(patient)}
              className="cursor-pointer group"
            >
              <Card
                title={
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-lg">
                      {patient.first_name} {patient.last_name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                      {patient.blood_type}
                    </span>
                  </div>
                }
                className="group-hover:border-indigo-200 transition-all duration-300"
              >
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {patient.date_of_birth
                        ? getAge(patient.date_of_birth)
                        : "N/A"}{" "}
                      years
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="capitalize">{patient.gender}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" />
                    <span>{patient.phone_number}</span>
                  </div>

                  {patient.users?.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-slate-400" />
                      <span className="truncate">{patient.users.email}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                    <MapPin
                      size={16}
                      className="text-slate-400 mt-0.5 shrink-0"
                    />
                    <span className="line-clamp-1">{patient.address}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Shield size={16} className="text-slate-400" />
                    <span className="text-xs truncate">
                      {patient.insurance_provider} • #
                      {patient.insurance_policy_number}
                    </span>
                  </div>

                  {showIds && (
                    <div className="text-xs font-mono text-slate-400 pt-1">
                      ID: {patient.patient_id}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
          {!patients || patients.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <p className="text-slate-500">No patients found.</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {patients?.map((patient: Patient) => (
                  <tr
                    key={patient.patient_id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => handlePatientClick(patient)}
                  >
                    {columns.map((col, index) => (
                      <td
                        key={`${patient.patient_id}-${index}`}
                        className={`px-6 py-4 text-sm text-slate-600 whitespace-nowrap group-hover:text-slate-900 transition-colors ${
                          col.className || ""
                        }`}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(patient)
                          : col.accessor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!patients || patients.length === 0 ? (
            <div className="p-8 text-center border-t border-slate-100">
              <p className="text-slate-500">No patients found.</p>
            </div>
          ) : null}
        </div>
      )}

      <CreatePatientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedPatient && (
        <PatientModal
          isOpen={isPatientModalOpen}
          onClose={() => {
            setIsPatientModalOpen(false);
            setSelectedPatient(null);
          }}
          patient={selectedPatient}
        />
      )}
    </div>
  );
};

export default Patients;

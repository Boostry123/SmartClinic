import React, { useState } from "react";
import usePatients from "../../hooks/usePatients";
import useTreatments from "../../hooks/useTreatments";
import useDoctors from "../../hooks/useDoctors";
import { createAppointment } from "../../api/appointments";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import type { Treatment } from "../../api/types/treatments";
import CreateAppointmentCalendar from "../CreateAppointmentCalendar";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const QueryClient = useQueryClient();
  const {
    data: patients,
    isLoading: patientsLoading,
    isError: patientsError,
  } = usePatients({});
  const {
    data: treatments,
    isLoading: treatmentsLoading,
    isError: treatmentsError,
  } = useTreatments({});
  const {
    data: doctors,
    isLoading: doctorsLoading,
    isError: doctorError,
  } = useDoctors({});
  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    treatment_id: "",
    treatment_data: {} as Record<string, string | number | boolean>,
    start_time: "",
    end_time: "",
    notes: "",
  });
  const [selectedTreatment, setSelectedTreatment] = useState<
    Treatment | undefined
  >(undefined);

  if (!isOpen) return null;

  const handleSlotSelect = (isoString: string) => {
    const start = DateTime.fromISO(isoString);
    const endTime =
      selectedTreatment && start.isValid
        ? (start.plus({ minutes: selectedTreatment.estimated_time }).toISO() ??
          "")
        : "";

    setFormData((prev) => ({
      ...prev,
      start_time: isoString,
      end_time: endTime,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "treatment_id") {
      const treatment = treatments?.find((t) => t.id === value);
      setSelectedTreatment(treatment);
      const treatmentData: Record<string, string | number | boolean> = {};

      if (treatment) {
        treatment.template.fields.forEach((field) => {
          switch (field.type) {
            case "number":
              treatmentData[field.id] = field.defaultValue ?? 0;
              break;
            case "checkbox":
              treatmentData[field.id] = field.defaultValue ?? false;
              break;
            default: // text, textarea, select
              treatmentData[field.id] = field.defaultValue ?? "";
              break;
          }
        });
      }

      const start = DateTime.fromISO(formData.start_time);
      const endTime =
        treatment && start.isValid
          ? (start.plus({ minutes: treatment.estimated_time }).toISO() ?? "")
          : formData.end_time;

      setFormData((prev) => ({
        ...prev,
        treatment_id: value,
        treatment_data: treatmentData,
        end_time: endTime,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData);
      await createAppointment(formData);
      QueryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    if (patientsLoading || treatmentsLoading || doctorsLoading) {
      return <p>Loading...</p>;
    }

    if (patientsError || treatmentsError || doctorError) {
      return <p>Error loading data. Please try again later.</p>;
    }

    const selectedDoctor = doctors?.find((d) => d.id === formData.doctor_id);

    return (
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <div className="mb-4">
            <label
              htmlFor="patient_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Patient
            </label>
            <select
              id="patient_id"
              name="patient_id"
              required
              value={formData.patient_id}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a patient</option>
              {patients?.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="doctor_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Doctor
            </label>
            <select
              id="doctor_id"
              name="doctor_id"
              required
              value={formData.doctor_id}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a doctor</option>
              {doctors?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.users.name} {d.users.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="treatment_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Treatment
            </label>
            <select
              id="treatment_id"
              name="treatment_id"
              required
              value={formData.treatment_id}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a treatment</option>
              {treatments?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.treatment_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.start_time}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Appointment
            </button>
          </div>
        </div>
        <div className="border-l pl-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Appointment Time{" "}
            {formData.start_time &&
              `(Selected: ${DateTime.fromISO(formData.start_time).toLocaleString(DateTime.DATETIME_SHORT)})`}
          </label>
          <CreateAppointmentCalendar
            doctor={selectedDoctor}
            treatmentDuration={selectedTreatment?.estimated_time}
            onSlotSelect={handleSlotSelect}
          />
          {!formData.start_time && (
            <p className="text-xs text-red-500 mt-2">
              Please select a slot on the calendar
            </p>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-dvw max-h-[90vh] overflow-y-auto m-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default CreateAppointmentModal;

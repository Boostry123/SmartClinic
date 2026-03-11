import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useTreatmentEngine from "../hooks/useTreatmentEngine";
//Stores
import { useAuthStore } from "../store/authStore";
//API
import { updateAppointment } from "../api/appointments";
//Types
import type { Treatment, Field, FormValues } from "../api/types/treatments";

import useAppointments from "../hooks/useAppointments";
import { Loader } from "lucide-react";
import {
  AppointmentStatusEnum,
  statusStyles,
  type AppointmentStatus,
} from "../api/types/appointments";

interface AppointmentEngineProps {
  appointmentId: string;
  template: Treatment;
  initialData: FormValues;
  onSuccess: () => void;
}

const AppointmentEngine = ({
  appointmentId,
  template,
  initialData,
  onSuccess,
}: AppointmentEngineProps) => {
  const queryClient = useQueryClient();
  const userRole = useAuthStore.getState().user?.user_metadata.role;
  const userIsDoctorOrAdmin = userRole === "doctor" || userRole === "admin";
  const { values, handleInputChange } = useTreatmentEngine(
    template,
    initialData,
  );
  const { data: appointmentInfo, isLoading } = useAppointments({
    id: appointmentId,
  });

  const [statusClicked, setStatusClicked] =
    useState<AppointmentStatus>("confirmed");
  useEffect(() => {
    if (appointmentInfo?.[0]?.status) {
      setStatusClicked(appointmentInfo[0].status);
    }
  }, [appointmentInfo]);

  const handleStatusClick = (status: AppointmentStatus) => {
    setStatusClicked(status);
  };

  const handleEditButton = async () => {
    try {
      if (statusClicked === AppointmentStatusEnum.COMPLETED) {
        handleDoneButton();
      } else {
        await updateAppointment({
          id: appointmentId,
          treatment_data: values,
          status: statusClicked,
        });
      }

      console.log("Appointment updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Failed to update appointment: ${error.message}`);
      }
    }
  };
  const handleDoneButton = async () => {
    setStatusClicked(AppointmentStatusEnum.COMPLETED);
    try {
      await updateAppointment({
        id: appointmentId,
        status: AppointmentStatusEnum.COMPLETED,
        treatment_data: values,
      });
      console.log("Appointment updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Failed to complete appointment: ${error.message}`);
      }
    }
  };

  const renderInput = (field: Field) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      onChange: handleInputChange,
      required: field.required,
      className:
        "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
    };

    switch (field.type) {
      case "number":
        return (
          <input
            type="number"
            {...commonProps}
            value={values[field.id] as number}
            placeholder={field.placeholder}
          />
        );
      case "textarea":
        return <textarea {...commonProps} value={values[field.id] as string} />;
      case "select":
        return (
          <select {...commonProps} value={values[field.id] as string}>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id={field.id}
              name={field.id}
              checked={values[field.id] as boolean}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
        );
      default: // text and other input types
        return (
          <input
            type="text"
            {...commonProps}
            value={values[field.id] as string}
            placeholder={field.placeholder}
          />
        );
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  } else {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto my-12 border border-slate-200">
        <div className="flex justify-between items-baseline mb-2">
          <h2 className="text-3xl font-bold text-gray-900">
            {template.treatment_name}
          </h2>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm font-semibold rounded-full">
            {template.estimated_time} min
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Version {template.template.version}
        </p>
        <form>
          <div className="space-y-6">
            {template.template.fields.map((field: Field) => (
              <div
                key={field.id}
                className={
                  field.type === "checkbox" ? "flex items-center gap-4" : ""
                }
              >
                {field.type !== "checkbox" && (
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                )}
                {renderInput(field)}
                {field.type === "checkbox" && (
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium text-gray-800"
                  >
                    {field.label}
                  </label>
                )}
              </div>
            ))}
          </div>
          <div className="border-t mt-5 pt-5 text-center">
            <label className="block mb-4 text-sm font-medium text-gray-800">
              Status
            </label>

            {/* Flex container to center and wrap buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {(
                Object.values(AppointmentStatusEnum) as AppointmentStatus[]
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusClick(status)}
                  className={
                    statusClicked === status
                      ? statusStyles[status]
                      : "px-4 py-2 rounded-md border bg-gray-100 text-gray-800 border-gray-300"
                  }
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-200 flex items-center gap-4 font-medium">
            {userIsDoctorOrAdmin ? (
              <button
                type="button"
                onClick={handleEditButton}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update
              </button>
            ) : null}
            {userIsDoctorOrAdmin ? (
              <button
                type="button"
                onClick={handleDoneButton}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Done
              </button>
            ) : null}
          </div>
        </form>
      </div>
    );
  }
};
export default AppointmentEngine;

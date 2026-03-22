import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import useTreatmentEngine from "../hooks/useTreatmentEngine";
import { useAuthStore } from "../store/authStore";
import { updateAppointment } from "../api/appointments";
import type { Treatment, Field, FormValues } from "../api/types/treatments";
import useAppointments from "../hooks/useAppointments";
import useDoctors from "../hooks/useDoctors";
import { Loader } from "lucide-react";
import {
  AppointmentStatusEnum,
  statusStyles,
  type AppointmentStatus,
} from "../api/types/appointments";
import { ImageField } from "./images/ImageField";
import WarningSnippet from "./Warning";

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
  const user = useAuthStore((state) => state.user);
  const userRole = user?.user_metadata.role;

  const { values, handleInputChange } = useTreatmentEngine(
    template,
    initialData,
  );

  const { data: appointmentInfo, isLoading: isAppointmentLoading } =
    useAppointments({
      id: appointmentId,
    });

  const { data: doctors, isLoading: isDoctorsLoading } = useDoctors({
    user_id: user?.id || "",
  });

  const appointment = appointmentInfo?.[0];
  const currentDoctorProfile = doctors?.[0];

  const canEdit = useMemo(() => {
    if (userRole === "admin") return true;
    if (userRole === "doctor" && currentDoctorProfile && appointment) {
      return currentDoctorProfile.id === appointment.doctor_id;
    }
    return false;
  }, [userRole, currentDoctorProfile, appointment]);

  const [statusClicked, setStatusClicked] =
    useState<AppointmentStatus>("confirmed");
  const [prevSourceStatus, setPrevSourceStatus] = useState<
    AppointmentStatus | undefined
  >(undefined);

  if (appointment?.status && appointment.status !== prevSourceStatus) {
    setPrevSourceStatus(appointment.status);
    setStatusClicked(appointment.status);
  }

  const [successLoading, setSuccessLoading] = useState(false);

  const onImageFieldChange = useCallback(
    (id: string, file: File | null) => {
      if (!canEdit) return;
      handleInputChange({
        target: { name: id, value: file, type: "file" },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [handleInputChange, canEdit],
  );

  const handleStatusClick = (status: AppointmentStatus) => {
    if (canEdit) setStatusClicked(status);
  };

  const handleSave = async (statusOverride?: AppointmentStatus) => {
    try {
      setSuccessLoading(true);
      const finalStatus = statusOverride || statusClicked;
      await updateAppointment({
        id: appointmentId,
        treatment_data: values,
        status: finalStatus,
      });
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setSuccessLoading(false);
      onSuccess();
    } catch (error) {
      setSuccessLoading(false);
      console.error(error);
    }
  };

  const renderInput = (field: Field) => {
    const isFieldDisabled = !canEdit;
    const commonProps = {
      id: field.id,
      name: field.id,
      onChange: handleInputChange,
      required: field.required,
      disabled: isFieldDisabled,
      className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
        isFieldDisabled ? "bg-gray-100 cursor-default opacity-75" : "bg-white"
      }`,
    };

    switch (field.type) {
      case "image":
        return (
          <ImageField
            key={field.id}
            initialUrl={
              typeof values[field.id] === "string"
                ? (values[field.id] as string)
                : null
            }
            onImageChange={(file) => onImageFieldChange(field.id, file)}
            disabled={isFieldDisabled}
          />
        );
      case "number":
        return (
          <input
            type="number"
            {...commonProps}
            value={(values[field.id] as number) || ""}
            placeholder={field.placeholder}
          />
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={(values[field.id] as string) || ""}
          />
        );
      case "select":
        return (
          <select {...commonProps} value={(values[field.id] as string) || ""}>
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
              {...commonProps}
              checked={!!values[field.id]}
              className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                isFieldDisabled ? "cursor-default opacity-50" : ""
              }`}
            />
          </div>
        );
      default:
        return (
          <input
            type="text"
            {...commonProps}
            value={(values[field.id] as string) || ""}
            placeholder={field.placeholder}
          />
        );
    }
  };

  if (isAppointmentLoading || isDoctorsLoading || successLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  const actionBtnClass = `w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-all ${
    canEdit
      ? "text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
      : "text-gray-400 bg-gray-200 cursor-default"
  }`;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto my-12 border border-slate-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {template.treatment_name}
          </h2>
          {!canEdit && (
            <div className="mt-2">
              <WarningSnippet message="View Only: You are not the assigned doctor for this appointment." />
            </div>
          )}
        </div>
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
          <div className="flex flex-wrap justify-center gap-3">
            {(Object.values(AppointmentStatusEnum) as AppointmentStatus[]).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusClick(status)}
                  disabled={!canEdit}
                  className={`${
                    statusClicked === status
                      ? statusStyles[status]
                      : "px-4 py-2 rounded-md border bg-gray-100 text-gray-800 border-gray-300"
                  } ${!canEdit ? "opacity-50 cursor-default" : "cursor-pointer"}`}
                >
                  {status}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-200 flex items-center gap-4 font-medium">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={!canEdit}
            className={actionBtnClass}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => handleSave(AppointmentStatusEnum.COMPLETED)}
            disabled={!canEdit}
            className={actionBtnClass}
          >
            Done
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentEngine;

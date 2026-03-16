import React, { useCallback } from "react";
import useTreatmentEngine from "../hooks/useTreatmentEngine";
import type { Treatment, Field } from "../api/types/treatments";
import { ImageField } from "./images/ImageField";

interface TreatmentEngineProps {
  template: Treatment;
}

const TreatmentEngine: React.FC<TreatmentEngineProps> = ({ template }) => {
  const { values, handleInputChange } = useTreatmentEngine(template);

  const handleImageChange = useCallback(
    (fieldId: string, file: File | null) => {
      handleInputChange({
        target: {
          name: fieldId,
          value: file,
          type: "file",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [handleInputChange],
  );

  const renderInput = (field: Field) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      onChange: handleInputChange,
      required: field.required,
      className:
        "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
    };

    switch (field.type) {
      case "number":
        return (
          <input
            type="number"
            {...commonProps}
            value={(values[field.id] as number) ?? ""}
          />
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={(values[field.id] as string) ?? ""}
            rows={3}
          />
        );
      case "select":
        return (
          <select {...commonProps} value={(values[field.id] as string) ?? ""}>
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            {...commonProps}
            checked={!!values[field.id]}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        );
      case "image":
        return (
          <ImageField
            label={field.label}
            onImageChange={(file) => handleImageChange(field.id, file)}
          />
        );
      default:
        return (
          <input
            type="text"
            {...commonProps}
            value={(values[field.id] as string) ?? ""}
          />
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting values:", values);
  };

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {template.template.fields.map((field) => (
          <div
            key={field.id}
            className={
              field.type === "checkbox" ? "flex items-center gap-3" : "block"
            }
          >
            {field.type !== "checkbox" && (
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {renderInput(field)}
            {field.type === "checkbox" && (
              <label
                htmlFor={field.id}
                className="text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default TreatmentEngine;

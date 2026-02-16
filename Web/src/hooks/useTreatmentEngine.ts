import { useState, useCallback, useEffect } from "react";
//Types
import type { Treatment, FormValues, Field } from "../api/types/treatments";

const useTreatmentEngine = (template: Treatment, initialData?: FormValues) => {
  const getInitialState = useCallback(() => {
    const initialState: FormValues = {};

    template.template.fields.forEach((field: Field) => {
      // Priority: 1. Saved Data, 2. Template Default, 3. Empty Fallback
      initialState[field.id] =
        initialData?.[field.id] ??
        field.defaultValue ??
        (field.type === "checkbox" ? false : "");
    });

    return initialState;
  }, [template, initialData]);

  const [values, setValues] = useState<FormValues>(getInitialState());

  useEffect(() => {
    setValues(getInitialState());
  }, [getInitialState]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setValues((prev) => ({ ...prev, [name]: finalValue }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setValues(getInitialState());
  }, [getInitialState]);

  return {
    values,
    handleInputChange,
    resetForm,
  };
};

export default useTreatmentEngine;

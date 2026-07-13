import { useState } from "react";

export default function useForm(initialState) {
  const [form, setForm] = useState(initialState);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const reset = () => {
    setForm(initialState);
  };

  const setValue = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    form,
    setForm,
    onChange,
    reset,
    setValue,
  };
}
import { useState } from "react";

export function useForm(initial) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function setFieldError(field, msg) {
    setErrors((err) => ({ ...err, [field]: msg }));
  }

  function reset() {
    setValues(initial);
    setErrors({});
  }

  return { values, errors, handleChange, setFieldError, reset };
}
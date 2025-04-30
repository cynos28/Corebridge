"use client";

import { UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type?: string;
  register: UseFormRegister<any>;
  name: string;
  defaultValue?: string | number;
  error?: string;
  [key: string]: any; // For any additional input props
}

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  ...inputProps
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        {...register(name)}
        defaultValue={defaultValue}
        className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
        {...inputProps}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;

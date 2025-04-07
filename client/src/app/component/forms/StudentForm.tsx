"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  grade: z.coerce.number().min(1).max(12), // Convert string input to number
  class: z.string().min(1),
  sex: z.enum(["male", "female"])
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({
  type,
  data,
  onSuccess,
  onClose,
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
  onClose?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const onSubmit = async (formData: Inputs) => {
    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/students${type === "update" ? `/${data?._id}` : ""}`;
      
      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          // Only include password for new students
          password: type === "create" ? formData.password : undefined
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `Error: ${response.status}`);
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
      // Reset form after successful submission
      if (type === "create") {
        reset();
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add new student" : "Update student"}</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField
            label="Username"
            name="username"
            register={register}
            error={errors.username?.message}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            register={register}
            error={errors.email?.message}
          />
          {type === "create" && (
            <InputField
              label="Password"
              type="password"
              name="password"
              register={register}
              error={errors.password?.message}
            />
          )}
        </div>

        <div className="space-y-4">
          <InputField
            label="First Name"
            name="firstName"
            register={register}
            error={errors.firstName?.message}
          />
          <InputField
            label="Last Name"
            name="lastName"
            register={register}
            error={errors.lastName?.message}
          />
          <InputField
            label="Phone"
            name="phone"
            register={register}
            error={errors.phone?.message}
          />
        </div>

        <div className="space-y-4">
          <InputField
            label="Grade"
            type="number"
            name="grade"
            register={register}
            error={errors.grade?.message}
          />
          <InputField
            label="Class"
            name="class"
            register={register}
            error={errors.class?.message}
          />
        </div>

        <div className="space-y-4">
          <InputField
            label="Address"
            name="address"
            register={register}
            error={errors.address?.message}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Sex</label>
            <select
              {...register("sex")}
              className="ring-1 ring-purple-200 rounded-md p-2"
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.sex && (
              <span className="text-xs text-red-500">{errors.sex.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300"
        >
          {isLoading ? "Processing..." : type === "create" ? "Add Student" : "Update Student"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;

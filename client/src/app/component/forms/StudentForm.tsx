"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  grade: z.coerce.number().min(1).max(12),
  class: z.string().min(1, "Class is required"),
  sex: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  })
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
    defaultValues: {
      username: data?.username || '',
      email: data?.email || '',
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      phone: data?.phone || '',
      address: data?.address || '',
      grade: data?.grade || '',
      class: data?.class || '',
      sex: data?.sex || ''
    }
  });

  const onSubmit = async (formData: Inputs) => {
    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userId = localStorage.getItem('user-id');
      if (!userId) {
        throw new Error('No user ID found');
      }

      const payload = {
        ...formData,
        userId,
      };

      const url = `http://localhost:5000/api/students${type === "update" ? `/${data?._id}` : ""}`;
      
      if (type === "update" || !payload.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to process request');
      }

      toast.success(
        type === "create" 
          ? "Student created successfully" 
          : "Student updated successfully"
      );
      
      if (onSuccess) await onSuccess();
      if (onClose) onClose();
      
      if (type === "create") {
        reset();
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit form";
      setError(message);
      toast.error(message);
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-200/80 backdrop-blur-sm">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="px-8 py-6 bg-white border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {type === "create" ? "Add New Student" : "Update Student Information"}
                </h1>
                <p className="mt-1 text-gray-500">
                  {type === "create" 
                    ? "Fill in the details to create a new student profile" 
                    : "Update the student's information below"}
                </p>
              </div>
            </div>
          </div>

          <form className="p-8" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h2>
                    <div className="space-y-4">
                      <InputField
                        label="Username"
                        name="username"
                        register={register}
                        error={errors.username?.message}
                        className="bg-white"
                      />
                      <InputField
                        label="Email"
                        type="email"
                        name="email"
                        register={register}
                        error={errors.email?.message}
                        className="bg-white"
                      />
                      {type === "create" && (
                        <InputField
                          label="Password"
                          type="password"
                          name="password"
                          register={register}
                          error={errors.password?.message}
                          className="bg-white"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Details
                    </h2>
                    <div className="space-y-4">
                      <InputField
                        label="First Name"
                        name="firstName"
                        register={register}
                        error={errors.firstName?.message}
                        className="bg-white"
                      />
                      <InputField
                        label="Last Name"
                        name="lastName"
                        register={register}
                        error={errors.lastName?.message}
                        className="bg-white"
                      />
                      <InputField
                        label="Phone"
                        name="phone"
                        register={register}
                        error={errors.phone?.message}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                      Academic Information
                    </h2>
                    <div className="space-y-4">
                      <InputField
                        label="Grade"
                        type="number"
                        name="grade"
                        register={register}
                        error={errors.grade?.message}
                        className="bg-white"
                      />
                      <InputField
                        label="Class"
                        name="class"
                        register={register}
                        error={errors.class?.message}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Additional Information
                    </h2>
                    <div className="space-y-4">
                      <InputField
                        label="Address"
                        name="address"
                        register={register}
                        error={errors.address?.message}
                        className="bg-white"
                      />
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Sex</label>
                        <select
                          {...register("sex")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
                        >
                          <option value="">Select Sex</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        {errors.sex && (
                          <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  type === "create" ? "Add Student" : "Update Student"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;

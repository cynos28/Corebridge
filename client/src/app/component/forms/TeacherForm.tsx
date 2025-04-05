"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState, useRef } from "react";

const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  bloodType: z.string().min(1),
  birthday: z.string().min(1), // or z.coerce.date() if you want direct date
  sex: z.enum(["male", "female"]),
  subjects: z.array(z.string()).optional(),
  photoUrl: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const TeacherForm = ({
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
  const [subjects, setSubjects] = useState<string[]>(data?.subjects || []);
  const subjectInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
      birthday: data?.birthday ? data.birthday.split("T")[0] : "",
      subjects: data?.subjects || [],
    },
  });

  const addSubject = () => {
    if (subjectInput.current?.value) {
      setSubjects([...subjects, subjectInput.current.value]);
      subjectInput.current.value = "";
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData: Inputs) => {
    try {
      setIsLoading(true);
      setError("");

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append subjects
      subjects.forEach(subject => {
        submitData.append('subjects[]', subject);
      });

      // Append image if selected
      if (selectedImage) {
        submitData.append('photo', selectedImage);
      }

      const url = "http://localhost:5000/api/teachers" + (type === "update" ? `/${data._id}` : "");
      const res = await fetch(url, {
        method: type === "create" ? "POST" : "PUT",
        body: submitData, // Send as FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error: ${res.status}`);
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose(); // Close modal after success
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold text-purple-800">
        {type === "create" ? "Create a new teacher" : "Update teacher"}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Section */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-medium text-purple-700">Authentication</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                {...register("username")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.username && (
                <span className="text-xs text-red-500">{errors.username.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                {...register("email")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>
            {type === "create" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
                />
                {errors.password && (
                  <span className="text-xs text-red-500">{errors.password.message}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-medium text-purple-700">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">First Name</label>
              <input
                type="text"
                {...register("firstName")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.firstName && (
                <span className="text-xs text-red-500">{errors.firstName.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.lastName && (
                <span className="text-xs text-red-500">{errors.lastName.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="text"
                {...register("phone")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.phone && (
                <span className="text-xs text-red-500">{errors.phone.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Address</label>
              <input
                type="text"
                {...register("address")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.address && (
                <span className="text-xs text-red-500">{errors.address.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Blood Type</label>
              <select
                {...register("bloodType")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.bloodType && (
                <span className="text-xs text-red-500">{errors.bloodType.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Birthday</label>
              <input
                type="date"
                {...register("birthday")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthday && (
                <span className="text-xs text-red-500">{errors.birthday.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Sex</label>
              <select
                {...register("sex")}
                className="ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
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

        {/* Subjects Section */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-medium text-purple-700">Subjects</h2>
          <div className="flex gap-2">
            <input
              ref={subjectInput}
              type="text"
              placeholder="Add a subject"
              className="flex-1 ring-1 ring-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={addSubject}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-purple-50 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-purple-700">{subject}</span>
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="text-purple-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 border-2 border-dashed border-purple-200 rounded-lg overflow-hidden">
              {imagePreview || data?.photoUrl ? (
                <Image
                  src={imagePreview || data?.photoUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-50">
                  <span className="text-sm text-gray-400">No image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="px-4 py-2 text-sm text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 cursor-pointer"
            >
              Choose Photo
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 mt-6">
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
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : type === "create" ? "Create Teacher" : "Update Teacher"}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;

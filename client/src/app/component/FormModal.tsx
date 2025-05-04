"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update", 
    data?: any, 
    onSuccess?: () => void,
    onClose?: () => void
  ) => JSX.Element;
} = {
  teacher: (type, data, onSuccess, onClose) => (
    <TeacherForm 
      type={type} 
      data={data} 
      onSuccess={onSuccess} 
      onClose={onClose}
    />
  ),
  student: (type, data, onSuccess, onClose) => (
    <StudentForm 
      type={type} 
      data={data} 
      onSuccess={onSuccess} 
      onClose={onClose}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  role = "admin",
  onSuccess,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "meeting";
  type: "create" | "update" | "delete" | "download";
  data?: any;
  id?: number;
  role?: string;
  onSuccess?: () => void;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-cbYellow"
      : type === "update"
      ? "bg-cbPurple"
      : "bg-cbPurple";

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/${table}s/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete');
      }

      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }} className="p-4 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center disabled:bg-gray-400"
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </form>
      );
    }
    
    if (type === "create" || type === "update") {
      return forms[table](type, data, onSuccess, () => setOpen(false));
    }
    
    return "Form not found!";
  };

  const Button = () => {
    if (role === "student" && type !== "download") {
      return null;
    }

    return (
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt={`${type} icon`} width={16} height={16} />
      </button>
    );
  };

  return (
    <>
      <Button />
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExamFormProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  editData?: {
    _id: string;
    subject: string;
    class: string;
    teacher: string;
    date: string;
  } | null;
}

const ExamForm: React.FC<ExamFormProps> = ({ onClose, onSubmit, editData }) => {
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [date, setDate] = useState("");

  const [subjectError, setSubjectError] = useState("");
  const [classError, setClassError] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (editData) {
      setSubject(editData.subject);
      setClassName(editData.class);
      setTeacher(editData.teacher);
      setDate(editData.date.split("T")[0]); // assuming ISO format date
    }
  }, [editData]);

  // Subject change with live validation
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(input)) {
      setSubject(input);
      setSubjectError("");
    } else {
      setSubject(input);
      setSubjectError("Subject name should only contain letters and spaces.");
    }
  };

  // Class change with live validation (format: 1-13 dash letter)
  const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^(1[0-3]|[1-9])-[A-Za-z]$/;
    if (input === "" || regex.test(input)) {
      setClassName(input);
      setClassError("");
    } else {
      setClassName(input);
      setClassError("Class must be between 1–13, a dash, and a letter (e.g., 10-A).");
    }
  };

  // Teacher change with live validation
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(input)) {
      setTeacher(input);
      setTeacherError("");
    } else {
      setTeacher(input);
      setTeacherError("Teacher name should only contain letters and spaces.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validations
    const nameRegex = /^[A-Za-z\s]+$/;
    const classRegex = /^(1[0-3]|[1-9])-[A-Za-z]$/;

    let valid = true;

    if (!nameRegex.test(subject)) {
      setSubjectError("Subject name must contain only letters and spaces.");
      valid = false;
    }

    if (!classRegex.test(className)) {
      setClassError("Class must be between 1–13, a dash, and a letter (e.g., 10-A).");
      valid = false;
    }

    if (!nameRegex.test(teacher)) {
      setTeacherError("Teacher name must contain only letters and spaces.");
      valid = false;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setDateError("Date cannot be in the past.");
      valid = false;
    }

    if (!valid) return;

    // Clear errors
    setSubjectError("");
    setClassError("");
    setTeacherError("");
    setDateError("");

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("class", className);
    formData.append("teacher", teacher);
    formData.append("date", date);
    onSubmit(formData);
  };

  // For date min attribute
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editData ? "Edit Exam" : "Add New Exam"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="subject">Subject Name</Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={handleSubjectChange}
                placeholder="e.g., Mathematics"
                required
              />
              {subjectError && (
                <p className="text-red-500 text-sm mt-1">{subjectError}</p>
              )}
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                type="text"
                value={className}
                onChange={handleClassChange}
                placeholder="e.g., 10-A"
                required
              />
              {classError && (
                <p className="text-red-500 text-sm mt-1">{classError}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Input
              id="teacher"
                type="text"
                value={teacher}
                onChange={handleTeacherChange}
                placeholder="e.g., Mr Smith"
                required
            />
            {teacherError && (
              <p className="text-red-500 text-sm mt-1">{teacherError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="date">Due Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={todayStr}
              required
            />
            {dateError && (
              <p className="text-red-500 text-sm mt-1">{dateError}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData ? "Update Exam" : "Submit Exam"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;

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

  useEffect(() => {
    if (editData) {
      setSubject(editData.subject);
      setClassName(editData.class);
      setTeacher(editData.teacher);
      setDate(editData.date.split("T")[0]); // assuming ISO format date
    }
  }, [editData]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[A-Za-z\s]*$/;

    if (regex.test(input)) {
      setSubject(input);
      setSubjectError("");
    } else {
      setSubject(input);
      setSubjectError("Subject name should not contain numbers or symbols.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final check before submission
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(subject)) {
      setSubjectError("Subject name must contain only letters and spaces.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("class", className);
    formData.append("teacher", teacher);
    formData.append("date", date);
    onSubmit(formData);
  };

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
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g., 10A"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Input
              id="teacher"
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="e.g., Mr. Smith"
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Due Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
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

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ResultFormProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  editData?: {
    _id: string;
    subjectName: string;
    student: string;
    score: number;
    teacherName: string;
    className: string;
    dueDate: string;
  } | null;
}

const today = new Date().toISOString().split("T")[0];

const ResultForm: React.FC<ResultFormProps> = ({ onClose, onSubmit, editData }) => {
  const [subjectName, setSubjectName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [score, setScore] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");
  const [dueDate, setDueDate] = useState(today);

  useEffect(() => {
    if (editData) {
      setSubjectName(editData.subjectName);
      setStudentName(editData.student);
      setScore(editData.score.toString());
      setTeacherName(editData.teacherName);
      setClassName(editData.className);
      // Convert the exam date to YYYY-MM-DD format
      setDueDate(new Date(editData.dueDate).toISOString().split("T")[0]);
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subjectName", subjectName);
    formData.append("student", studentName);
    formData.append("score", score);
    formData.append("teacherName", teacherName);
    formData.append("className", className);
    formData.append("dueDate", dueDate);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {editData ? "Edit Result" : "Add New Result"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g., Mathematics"
                required
              />
            </div>
            <div>
              <Label htmlFor="student">Student</Label>
              <Input
                id="student"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g., 90"
                required
              />
            </div>
            <div>
              <Label htmlFor="className">Class</Label>
              <Input
                id="className"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g., 10A"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="teacherName">Teacher</Label>
            <Input
              id="teacherName"
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="e.g., Mr. Smith"
              required
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData ? "Update Result" : "Submit Result"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;

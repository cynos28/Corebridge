"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // error states
  const [subjError, setSubjError] = useState("");
  const [studError, setStudError] = useState("");
  const [scoreError, setScoreError] = useState("");
  const [teachError, setTeachError] = useState("");
  const [classError, setClassError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (editData) {
      setSubjectName(editData.subjectName);
      setStudentName(editData.student);
      setScore(editData.score.toString());
      setTeacherName(editData.teacherName);
      setClassName(editData.className);
      setDueDate(new Date(editData.dueDate).toISOString().split("T")[0]);
    }
  }, [editData]);

  const validateSubject = (value: string) => {
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setSubjError("Subject must contain only letters and spaces");
    } else {
      setSubjError("");
    }
  };

  const validateStudent = (value: string) => {
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setStudError("Student name must contain only letters and spaces");
    } else {
      setStudError("");
    }
  };

  const validateScore = (value: string) => {
    const num = Number(value);
    if (!/^[0-9]+$/.test(value) || num < 0 || num > 100) {
      setScoreError("Score must be a number between 0 and 100");
    } else {
      setScoreError("");
    }
  };

  const validateTeacher = (value: string) => {
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setTeachError("Teacher name must contain only letters and spaces");
    } else {
      setTeachError("");
    }
  };

  const validateClass = (value: string) => {
    if (!/^(?:[1-9]|1[0-3])-[A-Za-z]+$/.test(value)) {
      setClassError("Class must be in format 10-A with grade 1–13");
    } else {
      setClassError("");
    }
  };

  const validateDate = (value: string) => {
    if (value < today) {
      setDateError("Date cannot be in the past");
    } else {
      setDateError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // final check
    validateSubject(subjectName);
    validateStudent(studentName);
    validateScore(score);
    validateTeacher(teacherName);
    validateClass(className);
    validateDate(dueDate);

    if (subjError || studError || scoreError || teachError || classError || dateError) return;

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
                onChange={e => { setSubjectName(e.target.value); validateSubject(e.target.value); }}
                placeholder="e.g., Mathematics"
                required
              />
              {subjError && <p className="text-red-500 text-sm">{subjError}</p>}
            </div>
            <div>
              <Label htmlFor="student">Student</Label>
              <Input
                id="student"
                type="text"
                value={studentName}
                onChange={e => { setStudentName(e.target.value); validateStudent(e.target.value); }}
                placeholder="e.g., John Doe"
                required
              />
              {studError && <p className="text-red-500 text-sm">{studError}</p>}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={e => { setScore(e.target.value); validateScore(e.target.value); }}
                placeholder="e.g., 90"
                required
              />
              {scoreError && <p className="text-red-500 text-sm">{scoreError}</p>}
            </div>
            <div>
              <Label htmlFor="className">Class</Label>
              <Input
                id="className"
                type="text"
                value={className}
                onChange={e => { setClassName(e.target.value); validateClass(e.target.value); }}
                placeholder="e.g., 10-A"
                required
              />
              {classError && <p className="text-red-500 text-sm">{classError}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="teacherName">Teacher</Label>
            <Input
              id="teacherName"
              type="text"
              value={teacherName}
              onChange={e => { setTeacherName(e.target.value); validateTeacher(e.target.value); }}
              placeholder="e.g., Mr. Smith"
              required
            />
            {teachError && <p className="text-red-500 text-sm">{teachError}</p>}
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={e => { setDueDate(e.target.value); validateDate(e.target.value); }}
              min={today}
              required
            />
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !!subjError || !!studError || !!scoreError || !!teachError || !!classError || !!dateError
              }
            >
              {editData ? "Update Result" : "Submit Result"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;

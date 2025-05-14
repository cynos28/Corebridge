// src/components/StudentReport.tsx
import React from "react";

export interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  grade: number;
  address: string;
  class: string;
}

interface StudentReportProps {
  data: Student[];
}

const StudentReport: React.FC<StudentReportProps> = ({ data }) => (
  <div id="StudentReport" className="p-8 bg-white text-gray-800">
    {/* Report Header */}
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-[#C68EFD]">Corebridge Student Report</h1>
      <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
    </div>

    {/* Report Table */}
    <table className="min-w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border border-gray-300">Student Name</th>
          <th className="p-2 border border-gray-300">Student ID</th>
          <th className="p-2 border border-gray-300">Grade</th>
          <th className="p-2 border border-gray-300">Phone</th>
          <th className="p-2 border border-gray-300">Address</th>
        </tr>
      </thead>
      <tbody>
        {data.map((student) => (
          <tr key={student._id} className="even:bg-gray-50">
            <td className="p-2 border border-gray-300">{`${student.firstName} ${student.lastName}`}</td>
            <td className="p-2 border border-gray-300">{student.studentId}</td>
            <td className="p-2 border border-gray-300">{student.grade}</td>
            <td className="p-2 border border-gray-300">{student.phone || "N/A"}</td>
            <td className="p-2 border border-gray-300">{student.address}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Report Footer */}
    <div className="mt-8 text-center text-xs text-gray-500">
      <p>All registered students under Corebridge</p>
    </div>
  </div>
);

export default StudentReport;

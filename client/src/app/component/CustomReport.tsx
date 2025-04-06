// src/components/CustomReport.tsx
import React from "react";

export interface Result {
  _id: string;
  subjectName: string;
  student: string;
  score: number;
  teacherName: string;
  className: string;
  dueDate: string;
}

interface CustomReportProps {
  data: Result[];
}

const CustomReport: React.FC<CustomReportProps> = ({ data }) => (
  <div id="customReport" className="p-8 bg-white text-gray-800">
    {/* Report Header */}
    <div className="mb-8 text-center">
    <h1 className="text-3xl font-bold text-[#C68EFD]">Corebridge Results Report</h1>

      <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
    </div>

    {/* Report Table */}
    <table className="min-w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border border-gray-300">Subject Name</th>
          <th className="p-2 border border-gray-300">Student</th>
          <th className="p-2 border border-gray-300">Score</th>
          <th className="p-2 border border-gray-300">Teacher</th>
          <th className="p-2 border border-gray-300">Class</th>
          <th className="p-2 border border-gray-300">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="even:bg-gray-50">
            <td className="p-2 border border-gray-300">{item.subjectName}</td>
            <td className="p-2 border border-gray-300">{item.student}</td>
            <td className="p-2 border border-gray-300">{item.score}</td>
            <td className="p-2 border border-gray-300">{item.teacherName}</td>
            <td className="p-2 border border-gray-300">{item.className}</td>
            <td className="p-2 border border-gray-300">
              {new Date(item.dueDate).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Report Footer */}
    <div className="mt-8 text-center text-xs text-gray-500">
      <p>all results for the Corebridge students</p>
    </div>
  </div>
);

export default CustomReport;

// src/components/CustomTeacherReport.tsx
import React from "react";

export interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  classes: string[];
  joinedDate: string;
}

interface CustomTeacherReportProps {
  data: Teacher[];
}

const CustomTeacherReport: React.FC<CustomTeacherReportProps> = ({ data }) => (
  <div id="customTeacherReport" className="p-8 bg-white text-gray-800">
    {/* Report Header */}
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-[#C68EFD]">
        Corebridge Teacher Report
      </h1>
      <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
    </div>

    {/* Report Table */}
    <table className="min-w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border border-gray-300">Name</th>
          <th className="p-2 border border-gray-300">Email</th>
          <th className="p-2 border border-gray-300">Subjects</th>
          <th className="p-2 border border-gray-300">Classes</th>
          <th className="p-2 border border-gray-300">Joined Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((teacher) => (
          <tr key={teacher._id} className="even:bg-gray-50">
            <td className="p-2 border border-gray-300">
              {" "}
              {teacher.firstName} {teacher.lastName}
            </td>
            <td className="p-2 border border-gray-300">{teacher.email}</td>
            <td className="p-2 border border-gray-300">
              {(teacher.subjects || []).join(", ") || "N/A"}
            </td>
            <td className="p-2 border border-gray-300">
              {(teacher.classes || []).join(", ") || "N/A"}
            </td>

            <td className="p-2 border border-gray-300">
              {new Date(teacher.joinedDate).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Report Footer */}
    <div className="mt-8 text-center text-xs text-gray-500">
      <p>All registered teachers in Corebridge system</p>
    </div>
  </div>
);

export default CustomTeacherReport;

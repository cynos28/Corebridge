import React from "react";

export interface Assignment {
  _id: string;
  subjectName: string;
  className: string;
  teacherName: string;
  dueDate: string;
  document?: string;
}

interface Props {
  data: Assignment[];
}

const CustomAssignmentReport: React.FC<Props> = ({ data }) => {
  return (
    <div id="customAssignmentReport" className="p-8 bg-white text-gray-800">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#C68EFD]">
          Corebridge Assignment Report
        </h1>
        <br></br>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </p>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border border-gray-300">Subject Name</th>
            <th className="p-2 border border-gray-300">Class</th>
            <th className="p-2 border border-gray-300">Teacher</th>
            <th className="p-2 border border-gray-300">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="even:bg-gray-50">
              <td className="p-2 border border-gray-300">{item.subjectName}</td>
              <td className="p-2 border border-gray-300">{item.className}</td>
              <td className="p-2 border border-gray-300">{item.teacherName}</td>
              <td className="p-2 border border-gray-300">
                {new Date(item.dueDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>All active assignments for Corebridge students and staff.</p>
      </div>
    </div>
  );
};

export default CustomAssignmentReport;

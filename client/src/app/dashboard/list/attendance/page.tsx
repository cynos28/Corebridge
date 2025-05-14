"use client";

import Table from "@/app/component/Table";
import TableSearch from "@/app/component/TableSearch";
import Pagination from "@/app/component/Pagination";
import { useState } from "react";

// Dummy attendance data
const attendanceData = [
  {
    id: 1,
    date: "2025-05-01",
    className: "Grade 10 - A",
    studentName: "Nimal Perera",
    status: "Present",
  },
  {
    id: 2,
    date: "2025-05-01",
    className: "Grade 10 - A",
    studentName: "Sunethra Silva",
    status: "Absent",
  },
  {
    id: 3,
    date: "2025-05-01",
    className: "Grade 10 - A",
    studentName: "Kamal Rajapaksha",
    status: "Late",
  },
  {
    id: 4,
    date: "2025-05-02",
    className: "Grade 11 - B",
    studentName: "Ruwan Jayasuriya",
    status: "Present",
  },
  {
    id: 5,
    date: "2025-05-02",
    className: "Grade 11 - B",
    studentName: "Menaka Weerasinghe",
    status: "Present",
  },
];

// Columns for the attendance table
const columns = [
  { header: "Date", accessor: "date" },
  { header: "Class", accessor: "class" },
  { header: "Student Name", accessor: "studentName" },
  { header: "Status", accessor: "status" },
];

const AttendanceListPage = () => {
  const [data, setData] = useState(attendanceData);

  const renderRow = (item: typeof attendanceData[0]) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-2">{item.date}</td>
      <td className="p-2">{item.className}</td>
      <td className="p-2">{item.studentName}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "Present"
              ? "bg-green-200 text-green-800"
              : item.status === "Absent"
              ? "bg-red-200 text-red-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Attendance Records</h1>
        <TableSearch />
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default AttendanceListPage;

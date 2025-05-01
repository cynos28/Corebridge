"use client";

import FormModal from "@/app/component/FormModal";
import Pagination from "@/app/component/Pagination";
import Table from "@/app/component/Table";
import TableSearch from "@/app/component/TableSearch";
import { role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type Student = {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found');
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Add cache control to prevent caching
        cache: 'no-store'
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-id');
        window.location.href = '/';
        throw new Error('Authentication expired');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setStudents(data);
      setError(null);
    } catch (error: any) {
      const message = error.message || 'Failed to load students';
      console.error('Error fetching students:', error);
      setError(message);
      toast.error(message);
      setStudents([]);
      
      // Handle auth errors
      if (error.message.includes('authentication') || error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-id');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };
  const filteredStudent = students.filter((item) =>
    item.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    || item.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    || item.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    || item.phone?.toString().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: Student) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-cbPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{`${item.firstName} ${item.lastName}`}</h3>
          <p className="text-xs text-gray-500">Class {item.class}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-cbSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal
                table="student"
                type="update"
                data={item}
                onSuccess={fetchStudents}
              />
              <FormModal
                table="student"
                type="delete"
                id={item._id}
                onSuccess={fetchStudents}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading students...</div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
                  <Image src="/filter.png" alt="" width={14} height={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
                  <Image src="/sort.png" alt="" width={14} height={14} />
                </button>
                {(role === "admin" || role === "teacher") && (
                  <FormModal table="student" type="create" onSuccess={fetchStudents} />
                )}
              </div>
            </div>
          </div>
          <Table columns={columns} renderRow={renderRow} data={filteredStudent} />
          <Pagination />
        </>
      )}
    </div>
  );
};

export default StudentListPage;

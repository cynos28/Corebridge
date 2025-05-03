"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/app/component/Pagination";
import Table from "@/app/component/Table";
import TableSearch from "@/app/component/TableSearch";
import FormModal from "@/app/component/FormModal";
// Define table columns. You can adjust the headers and classes as needed.
const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "w-1/4",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "w-1/6",
  },
  {
    header: "Blood Type",
    accessor: "bloodType",
    className: "w-1/6",
  },
  {
    header: "Contact",
    accessor: "contact",
    className: "w-1/4",
  },
  {
    header: "Actions",
    accessor: "actions",
    className: "w-1/6",
  },
];

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers from the backend API
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5000/api/teachers", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        // You may want to redirect to login page here
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        // You may want to redirect to login page here
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete teacher');
      }

      await fetchTeachers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleUpdate = async (id: string, updatedData: any) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add all fields from updatedData to formData
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key === 'subjects' && Array.isArray(value)) {
          // Handle subjects array specially
          value.forEach((subject: string) => {
            formData.append('subjects[]', subject);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove Content-Type header to let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        // You may want to redirect to login page here
        return;
      }
  
      if (!response.ok) {
        throw new Error("Failed to update teacher");
      }
  
      await fetchTeachers(); // Refresh the list
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Render a row for each teacher in the table
  const renderRow = (teacher: any) => (
    <tr
      key={teacher._id}
      className="border-b border-gray-200 hover:bg-purple-50 transition-colors"
    >
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            {teacher.photoUrl ? (
              <Image
                src={`http://localhost:5000${teacher.photoUrl}`} // This path should now work
                alt={`${teacher.firstName} ${teacher.lastName}`}
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 48px) 100vw, 48px"
                priority
                onError={(e: any) => {
                  e.target.src = '/images/default/teacher.png';
                }}
              />
            ) : (
              <Image
                src="/images/default/teacher.png"  // Updated path
                alt="Default profile"
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 48px) 100vw, 48px"
              />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-xs text-gray-500">{teacher.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              {teacher.subjects?.join(", ") || "No subjects assigned"}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col items-start gap-1">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {teacher.teacherId || 'Not assigned'}
          </span>
          <span className="text-xs text-gray-500">Teacher ID</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col items-start gap-1">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {teacher.bloodType}
          </span>
          <span className="text-xs text-gray-500">Blood Type</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-900">{teacher.phone}</p>
          <p className="text-xs text-gray-500">{teacher.address}</p>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-2">
          <Link 
            href={`/list/teachers/${teacher._id}`}
            className="w-full px-4 py-2 text-sm text-center text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
          >
            View Details
          </Link>
          <FormModal
            table="teacher"
            type="update"
            data={teacher}
            onSuccess={fetchTeachers}
          >
            <button className="w-full px-4 py-2 text-sm text-center text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
              Update
            </button>
          </FormModal>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this teacher?')) {
                handleDelete(teacher._id);
              }
            }}
            className="w-full px-4 py-2 text-sm text-center text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return <div>Loading teachers...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP: Search, Filter, Sort and Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {/* Button to create a new teacher */}
            <FormModal table="teacher" type="create" onSuccess={fetchTeachers} />
          </div>
        </div>
      </div>
      {/* Teacher Table */}
      <Table columns={columns} renderRow={renderRow} data={teachers} />
      {/* Pagination Component */}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;
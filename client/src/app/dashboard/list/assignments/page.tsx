"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";

import Table from "@/app/component/Table";
import TableSearch from "@/app/component/TableSearch";
import Pagination from "@/app/component/Pagination";
import AssignmentForm from "@/app/component/forms/AssignmentForm";

type Assignment = {
  _id: string;
  subjectName: string;
  className: string;
  teacherName: string;
  dueDate: string;
  document?: string;
};

const columns = [
  { header: "Subject Name", accessor: "subjectName" },
  { header: "Class", accessor: "className" },
  { header: "Teacher", accessor: "teacherName", className: "hidden md:table-cell" },
  { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const AssignmentListPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<Assignment | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/assignments");
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data: Assignment[] = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleCreateAssignment = async (formData: FormData) => {
    try {
      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create assignment");
      const newAssignment = await res.json();
      setAssignments((prev) => [...prev, newAssignment]);
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  const handleUpdateAssignment = async (id: string, formData: FormData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update assignment");
      const updated = await res.json();
      setAssignments((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete assignment");
      await res.json();
      setAssignments((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const openCreateForm = () => {
    setIsEditMode(false);
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: Assignment) => {
    setIsEditMode(true);
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (isEditMode && editItem) {
      await handleUpdateAssignment(editItem._id, formData);
    } else {
      await handleCreateAssignment(formData);
    }
    setIsFormOpen(false);
  };

  const renderRow = (item: Assignment) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-cbPurpleLight">
      <td className="p-4">{item.subjectName}</td>
      <td>{item.className}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">{new Date(item.dueDate).toLocaleDateString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded" onClick={() => openEditForm(item)}>
            Edit
          </button>
          <button className="px-2 py-1 text-sm bg-red-500 text-white rounded" onClick={() => handleDeleteAssignment(item._id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            <button onClick={openCreateForm} className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <FaPlus size={14} />
            </button>
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={assignments} />
      <Pagination />

      {isFormOpen && (
        <AssignmentForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          editData={isEditMode ? editItem : null}
        />
      )}
    </div>
  );
};

export default AssignmentListPage;

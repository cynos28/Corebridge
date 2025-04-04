"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import ResultForm from "@/app/component/forms/ResultForm";
import TableSearch from "@/app/component/TableSearch";
import Table from "@/app/component/Table";
import Pagination from "@/app/component/Pagination";
import { role, resultsData } from "@/lib/data"; // For static sample data if needed

type Result = {
  _id: string;
  subjectName: string;
  student: string;
  score: number;
  teacherName: string;
  className: string;
  dueDate: string;
};

const columns = [
  { header: "Subject Name", accessor: "subjectName" },
  { header: "Student", accessor: "student" },
  { header: "Score", accessor: "score" },
  {
    header: "Teacher",
    accessor: "teacherName",
    className: "hidden md:table-cell",
  },
  { header: "Class", accessor: "className", className: "hidden md:table-cell" },
  {
    header: "Due Date",
    accessor: "dueDate",
    className: "hidden md:table-cell",
  },
  { header: "Actions", accessor: "action" },
];

const ResultListPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<Result | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      const data: Result[] = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const handleCreateResult = async (formData: FormData) => {
    try {
      const res = await fetch("http://localhost:5000/api/results", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create result");
      const newResult = await res.json();
      setResults((prev) => [...prev, newResult]);
    } catch (error) {
      console.error("Error creating result:", error);
    }
  };

  const handleUpdateResult = async (id: string, formData: FormData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/results/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update result");
      const updated = await res.json();
      setResults((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
    } catch (error) {
      console.error("Error updating result:", error);
    }
  };

  const handleDeleteResult = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?"
    );
    if (!confirmDelete) {
      return; 
    }

    try {
      const res = await fetch(`http://localhost:5000/api/results/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete result");
      await res.json();
      setResults((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting result:", error);
    }
  };

  const openCreateForm = () => {
    setIsEditMode(false);
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: Result) => {
    setIsEditMode(true);
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (isEditMode && editItem) {
      await handleUpdateResult(editItem._id, formData);
    } else {
      await handleCreateResult(formData);
    }
    setIsFormOpen(false);
  };

  const renderRow = (item: Result) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-cbPurpleLight"
    >
      <td className="p-4">{item.subjectName}</td>
      <td>{item.student}</td>
      <td>{item.score}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {new Date(item.dueDate).toLocaleDateString()}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
            onClick={() => openEditForm(item)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 text-sm bg-red-500 text-white rounded"
            onClick={() => handleDeleteResult(item._id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <button
                onClick={openCreateForm}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow"
              >
                <FaPlus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={results} />
      <Pagination />
      {isFormOpen && (
        <ResultForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          editData={isEditMode ? editItem : null}
        />
      )}
    </div>
  );
};

export default ResultListPage;

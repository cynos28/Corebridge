"use client";

import AssignmentForm from "@/app/component/AssignmentForm";
import { FaPlus } from "react-icons/fa";
import FormModal from "@/app/component/FormModal";
import Pagination from "@/app/component/Pagination";
import Table from "@/app/component/Table";
import TableSearch from "@/app/component/TableSearch";
import { assignmentsData, role } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";

type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Due Date",
    accessor: "dueDate",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const AssignmentListPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateAssignment = (formData: FormData) => {
    // Handle form submission here (e.g., API call)
    console.log("New assignment data:", Object.fromEntries(formData));
    setIsFormOpen(false); // Close the popup after submission
  };

  const renderRow = (item: Assignment) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-cbPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell">{item.teacher}</td>
      <td className="hidden md:table-cell">{item.dueDate}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher" || role === "student") && (
            <>
              {(role === "admin" || role === "teacher") && (
                <>
                  <FormModal table="assignment" type="update" data={item} />
                  <FormModal table="assignment" type="delete" id={item.id} />
                </>
              )}
              {role === "student" && (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                    onClick={() => {
                      const modal = document.createElement("div");
                      modal.className =
                        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

                      modal.innerHTML = `
                        <div class="bg-white p-6 rounded-md shadow-md w-96">
                          <h2 class="text-lg font-semibold mb-4">Upload Document</h2>
                          <input type="file" class="w-full mb-4 border p-2 rounded" />
                          <div class="flex justify-end gap-2">
                            <button class="px-4 py-2 bg-red-500 text-white rounded delete-btn">Delete</button>
                            <button class="px-4 py-2 bg-yellow-500 text-white rounded edit-btn">Edit</button>
                            <button class="px-4 py-2 bg-blue-500 text-white rounded upload-btn">Upload</button>
                          </div>
                        </div>
                      `;

                      modal.querySelector(".upload-btn")?.addEventListener("click", () => {
                        alert(`Document uploaded for assignment ID: ${item.id}`);
                        document.body.removeChild(modal);
                      });

                      modal.querySelector(".edit-btn")?.addEventListener("click", () => {
                        alert(`Edit document for assignment ID: ${item.id}`);
                      });

                      modal.querySelector(".delete-btn")?.addEventListener("click", () => {
                        alert(`Delete document for assignment ID: ${item.id}`);
                      });

                      modal.addEventListener("click", (e) => {
                        if (e.target === modal) {
                          document.body.removeChild(modal);
                        }
                      });

                      document.body.appendChild(modal);
                    }}
                  >
                    Upload
                  </button>
                  <button
                    className="px-2 py-1 text-sm bg-green-500 text-white rounded"
                    onClick={() => {
                      alert(`Download document for assignment ID: ${item.id}`);
                    }}
                  >
                    Download
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
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
            

              // Replace the button with:
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow"
              >
                <FaPlus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={assignmentsData} />

      {/* PAGINATION */}
      <Pagination />

      {/* ASSIGNMENT FORM POPUP */}
      {(role === "admin" || role === "teacher") && isFormOpen && (
        <AssignmentForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateAssignment}
        />
      )}
    </div>
  );
};

export default AssignmentListPage;
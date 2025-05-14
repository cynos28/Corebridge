"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlus, FaDownload } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import path from "path";

import Table from "@/app/component/Table";
import ResultTableSearch from "@/app/component/ResultTableSearch";
import Pagination from "@/app/component/Pagination";
import AssignmentForm from "@/app/component/forms/AssignmentForm";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { GrDownload } from "react-icons/gr";
import CustomAssignmentReport from "@/app/component/CustomAssigmentReport";
import { HiMiniXCircle } from "react-icons/hi2";
import Swal from 'sweetalert2'


type Assignment = {
  _id: string;
  subjectName: string;
  className: string;
  teacherName: string;
  dueDate: string;
  document?: string;
  studentSubmission?: {
    filePath: string;
    submittedAt?: string;
  };
};

const columns = [
  { header: "Subject Name", accessor: "subjectName" },
  { header: "Class", accessor: "className" },
  {
    header: "Teacher",
    accessor: "teacherName",
    className: "hidden md:table-cell",
  },
  {
    header: "Due Date",
    accessor: "dueDate",
    className: "hidden md:table-cell",
  },
  { header: "Actions", accessor: "action" },
];

const AssignmentListPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<Assignment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<string>("");
  const [showCustomAssignmentReport, setShowCustomAssignmentReport] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Get role from localStorage when component mounts
    const userRole = localStorage.getItem("user-role");
    setRole(userRole || "");
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token"); // Changed from "user-token"
      const loadingToast = toast.loading("Fetching assignments...");
      
      const res = await fetch("http://localhost:5000/api/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.dismiss(loadingToast);
      
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data: Assignment[] = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
    }
  };

  const handleCreateAssignment = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("token"); // Changed from "user-token"
      if (!token) {
        throw new Error("No authentication token found");
      }

      const loadingToast = toast.loading("Creating assignment...");
      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // Note: Don't set Content-Type when sending FormData
        },
        body: formData,
      });
      
      toast.dismiss(loadingToast);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create assignment");
      }
      
      const newAssignment = await res.json();
      setAssignments((prev) => [...prev, newAssignment]);
      toast.success("Assignment created successfully!");
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      toast.error(error.message || "Failed to create assignment");
    }
  };

  const handleUpdateAssignment = async (id: string, formData: FormData) => {
    try {
      const token = localStorage.getItem("token"); // Changed from "user-token"
      const loadingToast = toast.loading("Updating assignment...");
      
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      toast.dismiss(loadingToast);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update assignment");
      }
      
      const updated = await res.json();
      setAssignments((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      toast.success("Assignment updated successfully!");
    } catch (error: any) {
      console.error("Error updating assignment:", error);
      toast.error(error.message || "Failed to update assignment");
    }
  };

  const handleDeleteAssignment = async (id: string) => {
  // 1) Ask for confirmation
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This assignment will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("token")
      const loadingToast = toast.loading("Deleting assignment...")

      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.dismiss(loadingToast)

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete assignment")
      }

      await res.json()
      setAssignments(prev => prev.filter(item => item._id !== id))

      // 2) Show success
      await Swal.fire('Deleted!', 'Your assignment has been deleted.', 'success')
    } catch (error: any) {
      console.error("Error deleting assignment:", error)
      // 3) Show error
      await Swal.fire('Error', error.message || 'Failed to delete assignment', 'error')
      toast.error(error.message || "Failed to delete assignment")
    }
  } else {
    // optional: on cancel
    await Swal.fire('Cancelled', 'Your assignment is safe :)', 'info')
  }
}


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

  const handleUploadSubmission = async (id: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("submission", file);
      formData.append("studentId", localStorage.getItem("user-id") || "");

      const token = localStorage.getItem("token"); // Changed from "user-token"
      const loadingToast = toast.loading("Uploading assignment...");

      const response = await fetch(
        `http://localhost:5000/api/assignments/${id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      toast.success("Assignment submitted successfully!");
      await fetchAssignments();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload assignment");
    }
  };

  const handleDownloadTeacherDocument = async (
    id: string,
    filename: string
  ) => {
    try {
      if (!filename) {
        toast.error("No document available");
        return;
      }

      const token = localStorage.getItem("token"); // Changed from "user-token"
      const loadingToast = toast.loading("Downloading document...");

      const response = await fetch(
        `http://localhost:5000/api/assignments/${id}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.split("/").pop() || "assignment";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Document downloaded successfully!");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download document");
    }
  };

  const handleDownloadSubmission = async (id: string, filePath: string) => {
    try {
      if (!filePath) {
        toast.error("No submission available");
        return;
      }

      const token = localStorage.getItem("token"); // Changed from "user-token"
      const loadingToast = toast.loading("Downloading submission...");

      const response = await fetch(
        `http://localhost:5000/api/assignments/${id}/submission/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `student-submission-${id}${path.extname(filePath)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Student submission downloaded successfully!");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download submission");
    }
  };

  const filteredAssignments = assignments.filter((item) =>
    item.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const downloadCustomAssignmentReportPDF = async () => {
    const input = document.getElementById("customAssignmentReport");
    if (!input) return;

    try {
      const loadingToast = toast.loading("Generating PDF...");
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("assignment-report.pdf");
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const renderRow = (item: Assignment) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-cbPurpleLight"
    >
      <td className="p-4">{item.subjectName}</td>
      <td>{item.className}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">
        {new Date(item.dueDate).toLocaleDateString()}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "teacher" || role === "admin") && (
            <>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-400"
                onClick={() => openEditForm(item)}
                title="Edit Assignment"
              >
                <HiOutlinePencilSquare size={18} />
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-red-400"
                onClick={() => handleDeleteAssignment(item._id)}
                title="Delete Assignment"
              >
                <HiMiniArchiveBoxXMark size={18} />
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-green-400"
                onClick={() =>
                  handleDownloadTeacherDocument(item._id, item.document || "")
                }
                title="Download Assignment"
              >
                <GrDownload size={18} />
              </button>
              {item.studentSubmission && (
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-400"
                  onClick={() =>
                    handleDownloadSubmission(
                      item._id,
                      item.studentSubmission.filePath
                    )
                  }
                  title="Download Student Submission"
                >
                  <FaDownload size={18} />
                </button>
              )}
            </>
          )}

          {role === "student" && (
            <>
              <div className="relative">
                <input
                  type="file"
                  id={`upload-${item._id}`}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUploadSubmission(item._id, e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor={`upload-${item._id}`}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-green-400 cursor-pointer hover:bg-green-500"
                  title="Upload Assignment"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
              </div>
              {item.document && (
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500"
                  onClick={() =>
                    handleDownloadTeacherDocument(item._id, item.document)
                  }
                  title="Download Assignment"
                >
                  <FaDownload size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <ResultTableSearch
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-4 self-end">
            <button
              onClick={() =>
                setShowCustomAssignmentReport(!showCustomAssignmentReport)
              }
              className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow text-xs"
              title={showCustomAssignmentReport ? "Close Report" : "Show Report"}
            >
              {showCustomAssignmentReport ? (
                <HiMiniXCircle size={18} />
              ) : (
                <HiDocumentArrowDown size={18} />
              )}
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "teacher" && (
              <button
                onClick={openCreateForm}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow"
                title="Create Assignment"
              >
                <FaPlus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Sheet Container */}
      {showCustomAssignmentReport ? (
        <div>
          <CustomAssignmentReport data={filteredAssignments} />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={downloadCustomAssignmentReportPDF}
              className="px-4 py-2 bg-[#E9A5F1] text-white rounded-md hover:bg-[#C68EFD]"
            >
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md flex-1">
          <Table
            columns={columns}
            renderRow={renderRow}
            data={currentItems}
          />
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {isFormOpen && (
        <AssignmentForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          editData={isEditMode ? editItem : null}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default AssignmentListPage;

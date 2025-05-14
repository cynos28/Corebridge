"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import ResultForm from "@/app/component/forms/ResultForm";
import ResultTableSearch from "@/app/component/ResultTableSearch";
import Table from "@/app/component/Table";
import Pagination from "@/app/component/Pagination";
import { role } from "@/lib/data";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { HiDocumentArrowDown, HiMiniDocumentText } from "react-icons/hi2";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import CustomReport from "@/app/component/CustomReport";
import { HiMiniXCircle } from "react-icons/hi2";
import Swal from 'sweetalert2';



// Define the Result type
type Result = {
  _id: string;
  subjectName: string;
  student: string;
  score: number;
  teacherName: string;
  className: string;
  dueDate: string;
};

// Define columns for the table view
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  // Fetch results when the component mounts
  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem("user-role");
    setUserRole(storedRole || "");
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
  // 1) Ask for confirmation
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This result will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (!result.isConfirmed) {
    // user cancelled
    await Swal.fire('Cancelled', 'Your result is safe :)', 'info');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/results/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete result');
    await res.json();

    setResults(prev => prev.filter(item => item._id !== id));

    // 2) Show success
    await Swal.fire('Deleted!', 'Your result has been deleted.', 'success');
  } catch (error: any) {
    console.error('Error deleting result:', error);
    // 3) Show error
    await Swal.fire('Error', error.message || 'Failed to delete result', 'error');
  }
}


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

  // Filter results by subject name (using a fallback in case subjectName is undefined)
  const filteredResults = results.filter((item) =>
    (item.subjectName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PDF generation for the custom report view
  const downloadCustomReportPDF = async () => {
    const input = document.getElementById("customReport");
    if (!input) return;
    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("custom-result-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // PDF generation for individual result
  const generateResultPDF = (result: Result) => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("Student Result Details", 105, 20, { align: "center" });

    // Add school header
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text("Corebridge Education System", 105, 30, { align: "center" });

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const today = new Date();
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 105, 40, {
      align: "center",
    });

    // Add result information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Start y position
    let y = 60;

    // Add result details
    doc.text(`Subject: ${result.subjectName}`, 20, y);
    y += 10;
    doc.text(`Student: ${result.student}`, 20, y);
    y += 10;
    doc.text(`Score: ${result.score}`, 20, y);
    y += 10;
    doc.text(`Teacher: ${result.teacherName}`, 20, y);
    y += 10;
    doc.text(`Class: ${result.className}`, 20, y);
    y += 10;
    doc.text(`Date: ${new Date(result.dueDate).toLocaleDateString()}`, 20, y);
    y += 10;

    // Add grade assessment
    let grade = "";
    let gradeColor = [0, 0, 0];

    if (result.score >= 90) {
      grade = "A (Excellent)";
      gradeColor = [46, 125, 50]; // Green
    } else if (result.score >= 80) {
      grade = "B (Very Good)";
      gradeColor = [33, 150, 243]; // Blue
    } else if (result.score >= 70) {
      grade = "C (Good)";
      gradeColor = [255, 152, 0]; // Orange
    } else if (result.score >= 60) {
      grade = "D (Satisfactory)";
      gradeColor = [255, 193, 7]; // Amber
    } else {
      grade = "F (Needs Improvement)";
      gradeColor = [244, 67, 54]; // Red
    }

    y += 10;
    doc.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
    doc.setFontSize(14);
    doc.text(`Grade: ${grade}`, 20, y);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This is an official document from Corebridge Education System",
      105,
      280,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`result_${result.student}_${result.subjectName}.pdf`);
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
          {(userRole === "admin" || userRole === "teacher") && (
            <>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-400"
                onClick={() => openEditForm(item)}
                title="Edit Result"
              >
                <HiOutlinePencilSquare size={18} />
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-red-400"
                onClick={() => handleDeleteResult(item._id)}
                title="Delete Result"
              >
                <HiMiniArchiveBoxXMark size={18} />
              </button>
            </>
          )}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500"
            onClick={() => generateResultPDF(item)}
            title="Download Result PDF"
          >
            <HiMiniDocumentText size={18} />
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
          <ResultTableSearch
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-4 self-end">
            <button
              onClick={() => setShowCustomReport(!showCustomReport)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow text-xs"
            >
              {showCustomReport ? (
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
            {(role === "admin" || role === "teacher") && (
              <button
                onClick={openCreateForm}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow"
              >
                <FaPlus size={14} />
              </button>
            )}
            {/* Toggle for custom report view */}
          </div>
        </div>
      </div>

      {/* Render custom report view or the standard table view */}
      {showCustomReport ? (
        <div>
          <CustomReport data={filteredResults} />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={downloadCustomReportPDF}
              className="px-4 py-2 bg-[#E9A5F1] text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-[#C68EFD]"
            >
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        <div
          id="resultSheet"
          className="bg-white p-4 rounded-md flex-1 m-4 mt-0"
        >
          <Table
            columns={columns}
            renderRow={renderRow}
            data={filteredResults}
          />
        </div>
      )}

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

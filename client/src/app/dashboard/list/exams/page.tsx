"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import ExamForm from "@/app/component/forms/ExamForm";
import ResultTableSearch from "@/app/component/ResultTableSearch";
import Table from "@/app/component/Table";
import Pagination from "@/app/component/Pagination";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";

import { examsData, role } from "@/lib/data"; // If you have static sample data; otherwise, fetch from your server

type Exam = {
  _id: string;
  subject: string;
  class: string;
  teacher: string;
  date: string;
};

const columns = [
  { header: "Subject Name", accessor: "subject" },
  { header: "Class", accessor: "class" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ExamListPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/exams");
      if (!res.ok) throw new Error("Failed to fetch exams");
      const data: Exam[] = await res.json();
      setExams(data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleCreateExam = async (formData: FormData) => {
    try {
      const res = await fetch("http://localhost:5000/api/exams", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create exam");
      const newExam = await res.json();
      setExams((prev) => [...prev, newExam]);
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  const handleUpdateExam = async (id: string, formData: FormData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/exams/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update exam");
      const updated = await res.json();
      setExams((prev) => prev.map((item) => (item._id === id ? updated : item)));
    } catch (error) {
      console.error("Error updating exam:", error);
    }
  };

  const handleDeleteExam = async (id: string) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/exams/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete exam");
      await res.json();
      setExams((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  const handleDownloadExam = async (exam: Exam) => {
    try {
      // Create exam details content
      const content = `
        Exam Details
        ============
        Subject: ${exam.subject}
        Class: ${exam.class}
        Teacher: ${exam.teacher}
        Date: ${new Date(exam.date).toLocaleDateString()}
      `;

      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam-${exam.subject}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading exam:', error);
    }
  };

  const openCreateForm = () => {
    setIsEditMode(false);
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: Exam) => {
    setIsEditMode(true);
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (isEditMode && editItem) {
      await handleUpdateExam(editItem._id, formData);
    } else {
      await handleCreateExam(formData);
    }
    setIsFormOpen(false);
  };

  const filteredexam = exams.filter((item) =>
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = async () => {
    const input = document.getElementById("examSheet");
    if (!input) return;

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("exam-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  

  const renderRow = (item: Exam) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-cbPurpleLight">
      <td className="p-4">{item.subject}</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell">{item.teacher}</td>
      <td className="hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "student" && (
            <button 
              className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleDownloadExam(item)}
            >
              Download
            </button>
          )}
          {(role === "admin" || role === "teacher") && (
            <>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-400" onClick={() => openEditForm(item)}>
              <HiOutlinePencilSquare size={18}/>
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-red-400" onClick={() => handleDeleteExam(item._id)}>
              <HiMiniArchiveBoxXMark size={18}/>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <ResultTableSearch
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex items-center gap-4 self-end">
          <button
              onClick={downloadPDF}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow"
            >
              <HiDocumentArrowDown size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <button onClick={openCreateForm} className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
                <FaPlus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Sheet Container */}
      <div id="examSheet" className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <Table columns={columns} renderRow={renderRow} data={filteredexam} />  
      </div>
      <Pagination />

      {isFormOpen && (
        <ExamForm onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} editData={isEditMode ? editItem : null} />
      )}
    </div>
  );
};

export default ExamListPage;

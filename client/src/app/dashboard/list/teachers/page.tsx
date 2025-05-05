"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/app/component/Pagination";
import Table from "@/app/component/Table";
import TableSearch from "@/app/component/TableSearch";
import FormModal from "@/app/component/FormModal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CustomTeacherReport from "@/app/component/CustomTeacherReport";
import { HiDocumentArrowDown, HiMiniDocumentText } from "react-icons/hi2";
import { HiMiniXCircle } from "react-icons/hi2"; // adjust path if needed

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showTeacherReport, setShowTeacherReport] = useState(false);

  // Fetch teachers from the backend API
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
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
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        // You may want to redirect to login page here
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      await fetchTeachers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const handleUpdate = async (id: string, updatedData: any) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Add all fields from updatedData to formData
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key === "subjects" && Array.isArray(value)) {
          // Handle subjects array specially
          value.forEach((subject: string) => {
            formData.append("subjects[]", subject);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove Content-Type header to let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
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

  const filteredStudent = teachers.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toString().includes(searchTerm.toLowerCase())
  );

  const downloadTeacherReportPDF = async () => {
    const input = document.getElementById("customTeacherReport");
    if (!input) return;
    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("teacher-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generateTeacherPDF = (teacher: any) => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("Teacher Profile", 105, 20, { align: "center" });

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

    // Add teacher information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Define y coordinate starting point for teacher details
    let y = 60;

    // Add teacher details with section formatting
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text("Personal Information", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${teacher.firstName} ${teacher.lastName}`, 20, y);
    y += 10;
    doc.text(`Teacher ID: ${teacher.teacherId || "Not assigned"}`, 20, y);
    y += 10;
    doc.text(`Email: ${teacher.email || "N/A"}`, 20, y);
    y += 10;
    doc.text(`Phone: ${teacher.phone || "N/A"}`, 20, y);
    y += 10;
    doc.text(`Blood Type: ${teacher.bloodType || "N/A"}`, 20, y);
    y += 10;
    doc.text(`Address: ${teacher.address || "N/A"}`, 20, y);
    y += 15;

    // Add teaching information
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text("Teaching Information", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Add subjects
    doc.text("Subjects:", 20, y);
    y += 10;
    if (teacher.subjects && teacher.subjects.length > 0) {
      teacher.subjects.forEach((subject: string) => {
        doc.text(`• ${subject}`, 30, y);
        y += 8;
      });
    } else {
      doc.text("• No subjects assigned", 30, y);
      y += 10;
    }

    // Additional qualification information if available
    if (teacher.qualifications) {
      y += 5;
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text("Qualifications", 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(teacher.qualifications, 20, y);
    }

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This is an official document from Corebridge Education System",
      105,
      280,
      { align: "center" }
    );

    // Save the PDF with teacher name
    doc.save(`Teacher-${teacher.firstName}-${teacher.lastName}.pdf`);
  };

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
                  e.target.src = "/images/default/teacher.png";
                }}
              />
            ) : (
              <Image
                src="/images/default/teacher.png" // Updated path
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
            {teacher.teacherId || "Not assigned"}
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
          <button
            onClick={() => generateTeacherPDF(teacher)}
            className="w-full px-4 py-2 text-sm text-center text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
          >
            Download PDF
          </button>
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
              if (
                window.confirm("Are you sure you want to delete this teacher?")
              ) {
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
          <TableSearch
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowTeacherReport(!showTeacherReport)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow text-xs"
          >
            {showTeacherReport ? (
              <HiMiniXCircle size={18} />
            ) : (
              <HiDocumentArrowDown size={18} />
            )}
          </button>

          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {/* Button to create a new teacher */}
            <FormModal
              table="teacher"
              type="create"
              onSuccess={fetchTeachers}
            />
          </div>
        </div>
      </div>
      {showTeacherReport ? (
        <>
          <div className="mt-6">
            <CustomTeacherReport data={filteredStudent} />
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={downloadTeacherReportPDF}
              className="px-4 py-2 bg-[#E9A5F1] text-white rounded-md hover:bg-[#C68EFD] transition-transform transform hover:scale-105"
            >
              Download PDF
            </button>
          </div>
        </>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={filteredStudent} />
      )}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;

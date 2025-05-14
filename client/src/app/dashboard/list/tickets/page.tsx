"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';


interface TicketFormProps {
  onSubmit: (ticket: Ticket) => void;
  onCancel: () => void;
  initialData?: Ticket | null;
}

interface Ticket {
  _id?: string;
  studentName: string;
  grade: string;
  issue: string;
  description: string;
}

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("user-role");
    if (storedRole) setRole(storedRole); // ✅ Retrieve user role
  }, []);

  useEffect(() => {
    fetchTickets(); // ✅ Load tickets when component mounts
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tickets");
      const data = await response.json();
      setTickets(data); // ✅ Update state with fetched tickets
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleCreateTicket = async (ticket: Ticket) => {
    try {
      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      const newTicket = await response.json();
      setTickets([...tickets, newTicket]); // ✅ Add new ticket to state
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleUpdateTicket = async (id: string, ticket: Ticket) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      const updatedTicket = await response.json();
      setTickets(tickets.map((t) => (t._id === id ? updatedTicket : t))); // 🔧 Replace updated ticket
      setIsFormOpen(false);
      setEditTicket(null);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This action cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    try {
      await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: "DELETE",
      });

      setTickets((prev) => prev.filter((t) => t._id !== id)); // ✅ Remove from UI

      await Swal.fire(
        'Deleted!',
        'The ticket has been successfully deleted.',
        'success'
      );
    } catch (error) {
      console.error("Error deleting ticket:", error);
      Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
    }
  }
};

  const openEditForm = (ticket: Ticket) => {
    setEditTicket(ticket); // 🔧 Set ticket to be edited
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const generateTicketPDF = (ticket: Ticket) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("Support Ticket Details", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text("Corebridge Education System", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const today = new Date();
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 105, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 60;

    if (ticket._id) {
      doc.text(`Ticket ID: ${ticket._id}`, 20, y);
      y += 10;
    }

    doc.text(`Student Name: ${ticket.studentName}`, 20, y); y += 10;
    doc.text(`Grade: ${ticket.grade}`, 20, y); y += 10;
    doc.text(`Issue: ${ticket.issue}`, 20, y); y += 10;

    doc.text("Description:", 20, y); y += 10;
    const splitDescription = doc.splitTextToSize(ticket.description, 170);
    doc.text(splitDescription, 20, y);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("This is an official document from Corebridge Education System", 105, 280, { align: "center" });

    doc.save(`ticket_${ticket._id || Date.now()}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-cbYellow text-white px-4 py-2 rounded-lg hover:bg-[#236d6d] transition duration-200"
        >
          New Ticket
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{ticket.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {role === "student" && (
                      <>
                        <button onClick={() => openEditForm(ticket)} className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition" title="Edit">✎</button>
                        <button onClick={() => handleDeleteTicket(ticket._id!)} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-600 transition" title="Delete"><MdDelete /></button>
                      </>
                    )}
                    <button onClick={() => generateTicketPDF(ticket)} className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition" title="Download PDF">📄</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔧 Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isEditMode ? "Update" : "Submit"} a Support Ticket
            </h2>
            <TicketForm
              onSubmit={
                isEditMode && editTicket?._id
                  ? (data) => handleUpdateTicket(editTicket._id!, data)
                  : handleCreateTicket
              }
              initialData={editTicket}
              onCancel={() => {
                setIsFormOpen(false);
                setIsEditMode(false);
                setEditTicket(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Ticket Form Component
const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [studentName, setStudentName] = useState(initialData?.studentName || "");
  const [grade, setGrade] = useState(initialData?.grade || "");
  const [issue, setIssue] = useState(initialData?.issue || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [errors, setErrors] = useState<{ studentName?: string; grade?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!/^[A-Za-z\s]+$/.test(studentName)) {
      newErrors.studentName = "Only letters and spaces are allowed."; // ✅ Validate name
    }
    if (!/^(1[0-3]|[1-9])-[A-Za-z]$/.test(grade)) {
  newErrors.grade = "Grade must be in the format 1-13 with a single letter (e.g., 10-A)";
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // ✅ Run validations before submitting

    onSubmit({ studentName, grade, issue, description });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
          <input type="text" id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter student name" />
          {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName}</p>}
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
          <input type="text" id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 10A" />
          {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
        </div>

        <div>
          <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
          <input type="text" id="issue" value={issue} onChange={(e) => setIssue(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Briefly state the issue" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[100px]" placeholder="Provide detailed description" />
        </div>

        <div>
          <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
          <input type="file" id="document" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={onCancel} className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">Cancel</button>
          <button type="submit" className="w-full bg-cbYellow text-white py-2 px-4 rounded-lg">{initialData ? "Update" : "Submit"} Ticket</button>
        </div>
      </div>
    </form>
  );
};

export default TicketsPage;

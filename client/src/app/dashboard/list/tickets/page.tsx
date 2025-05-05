"use client";

import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tickets');
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const handleCreateTicket = async (ticket: Ticket) => {
        try {
            const response = await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticket),
            });
            const newTicket = await response.json();
            setTickets([...tickets, newTicket]);
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };

    const handleUpdateTicket = async (id: string, ticket: Ticket) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticket),
            });
            const updatedTicket = await response.json();
            setTickets(tickets.map(t => t._id === id ? updatedTicket : t));
            setIsFormOpen(false);
            setEditTicket(null);
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    const handleDeleteTicket = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/api/tickets/${id}`, {
                method: 'DELETE',
            });
            setTickets(tickets.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    const openEditForm = (ticket: Ticket) => {
        setEditTicket(ticket);
        setIsEditMode(true);
        setIsFormOpen(true);
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

            {/* Tickets Table */}
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
                                    <button
                                        onClick={() => openEditForm(ticket)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTicket(ticket._id!)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Ticket Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <TicketForm
                        onSubmit={isEditMode && editTicket?._id 
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
            )}
        </div>
    );
};

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [studentName, setStudentName] = useState(initialData?.studentName || '');
    const [grade, setGrade] = useState(initialData?.grade || '');
    const [issue, setIssue] = useState(initialData?.issue || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ticketData: Ticket = {
            studentName,
            grade,
            issue,
            description
        };
        onSubmit(ticketData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {initialData ? 'Update' : 'Submit'} a Support Ticket
                </h2>

                <div className="space-y-6">
                    <div>
                        <label 
                            htmlFor="studentName" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Student Name
                        </label>
                        <input
                            type="text"
                            id="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter student name"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="grade" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Grade
                        </label>
                        <input
                            type="text"
                            id="grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter grade level"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="issue" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Issue
                        </label>
                        <input
                            type="text"
                            id="issue"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Briefly state the issue"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="description" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbSky focus:border-transparent transition duration-200 resize-y min-h-[100px]"
                            placeholder="Provide detailed description"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="document" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Upload Document
                        </label>
                        <input
                            type="file"
                            id="document"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-cbYellow text-white py-2 px-4 rounded-lg hover:bg-[#236d6d] transition duration-200 font-medium"
                        >
                            {initialData ? 'Update' : 'Submit'} Ticket
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TicketsPage;
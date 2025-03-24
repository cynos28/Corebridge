"use client";

import React, { useState } from 'react';

interface TicketFormProps {
    onSubmit: (ticket: Ticket) => void;
}

interface Ticket {
    studentName: string;
    grade: string;
    issue: string;
    description: string;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
    const [studentName, setStudentName] = useState('');
    const [grade, setGrade] = useState('');
    const [issue, setIssue] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ticket: Ticket = { studentName, grade, issue, description };
        onSubmit(ticket);
        setStudentName('');
        setGrade('');
        setIssue('');
        setDescription('');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Submit a Support Ticket
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y min-h-[100px]"
                            placeholder="Provide detailed description"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    >
                        Submit Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
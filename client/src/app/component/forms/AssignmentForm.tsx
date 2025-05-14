'use client';
import React, { useEffect, useState } from 'react';

interface AssignmentFormProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  editData?: {
    _id: string;
    subjectName: string;
    className: string;
    teacherName: string;
    dueDate: string;
    document?: string;
  } | null;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ onClose, onSubmit, editData }) => {
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (editData) {
      setSubjectName(editData.subjectName);
      setClassName(editData.className);
      setTeacherName(editData.teacherName);
      setDueDate(editData.dueDate.split('T')[0]);
    }
  }, [editData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(file.type)) {
        setFileError('Please upload only PDF or Word documents');
        setDocumentFile(null);
        return;
      }
      setFileError('');
      setDocumentFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;
    const formData = new FormData();
    formData.append('subjectName', subjectName);
    formData.append('className', className);
    formData.append('teacherName', teacherName);
    formData.append('dueDate', dueDate);
    if (documentFile) formData.append('document', documentFile);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-purple-600">📝</span>
            {editData ? 'Edit Assignment' : 'Add New Assignment'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <input type="text" value={subjectName} onChange={e => setSubjectName(e.target.value)} required placeholder="e.g., Mathematics" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <input type="text" value={className} onChange={e => setClassName(e.target.value)} required placeholder="e.g., 10A" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} required placeholder="e.g., Mr. Smith" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
            <div className="relative">
              <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="w-full file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
              {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
              {documentFile && !fileError && (<span className="text-sm text-gray-600 mt-1 block">Selected: {documentFile.name}</span>)}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={!!fileError} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{editData ? 'Update Assignment' : 'Submit Assignment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
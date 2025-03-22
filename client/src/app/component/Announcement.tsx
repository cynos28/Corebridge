import React from "react";

const Announcement = () => {
  return (
    <div className="bg-white p-4 rounded-md ">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-xl font-semibold text-gray-800">Corebridge Announcements</h1>
        <span className="text-xs text-blue-500 cursor-pointer">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-blue-100 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-blue-700">New Semester Begins</h2>
            <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
              2025-01-15
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Welcome to the new academic session at Corebridge! Classes will commence from January 20, 2025.
          </p>
        </div>
        <div className="bg-purple-100 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-purple-700">Exam Schedule Released</h2>
            <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
              2025-01-10
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            The exam timetable for the upcoming semester has been published. Please check your student portal for details.
          </p>
        </div>
        <div className="bg-yellow-100 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-yellow-700">Parent-Teacher Meeting</h2>
            <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
              2025-01-05
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            A parent-teacher meeting is scheduled for January 25, 2025. Kindly confirm your availability through the portal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcement;

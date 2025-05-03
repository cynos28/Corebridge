'use client';

import React from "react";
import { useAnnouncementContext } from "@/context/AnnouncementContext";

const Announcement = () => {
  const { notifications } = useAnnouncementContext();

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-xl font-semibold text-gray-800">Corebridge Announcements</h1>
        <span className="text-xs text-blue-500 cursor-pointer">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {notifications.map((notification) => (
          <div key={notification.id} className={`${notification.bgColor} rounded-md p-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`font-medium ${notification.textColor}`}>{notification.title}</h2>
              <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
                {notification.date}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            {notification.meetingLink && (
              <a 
                href={notification.meetingLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline text-sm mt-2 block"
              >
                Join Meeting
              </a>
            )}
          </div>
        ))}

        {/* Default announcements */}
    
      </div>
    </div>
  );
};

export default Announcement;

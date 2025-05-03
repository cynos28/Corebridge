'use client';

import React from "react";
import { X, Video } from "lucide-react";
import { useAnnouncementContext } from "@/context/AnnouncementContext";
import Link from "next/link";

const Announcement = () => {
  const { notifications, removeNotification } = useAnnouncementContext();

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-xl font-semibold text-gray-800">Announcements & Meetings</h1>
        <Link href="/dashboard/list/announcements" className="text-xs text-blue-500 cursor-pointer">
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No announcements or meetings yet</p>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`${notification.bgColor} rounded-md p-4 relative`}
            >
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Close announcement"
              >
                <X size={16} />
              </button>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notification.type === 'meeting' && (
                    <Video className="h-4 w-4 text-[#4A90E2]" />
                  )}
                  <h2 className={`font-medium ${notification.textColor}`}>
                    {notification.title}
                  </h2>
                </div>
                <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
                  {notification.date}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              {notification.type === 'meeting' && notification.meetingLink && (
                <a
                  href={notification.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block px-3 py-1 bg-[#4A90E2] text-white rounded-md text-xs hover:bg-[#357ABD] transition-colors"
                >
                  Join Meeting
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcement;

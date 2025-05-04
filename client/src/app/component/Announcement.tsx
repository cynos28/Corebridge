'use client';

import React from 'react';
import { useAnnouncementContext } from '@/context/AnnouncementContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Announcement = () => {
  const { notifications } = useAnnouncementContext();

  return (
    <Card className="bg-white p-4 rounded-md shadow-md">
      <CardHeader className="flex items-center justify-between border-b pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Corebridge Announcements
        </CardTitle>
        <span className="text-xs text-blue-500 cursor-pointer">View All</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 mt-4">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-600">No announcements available.</p>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${notification.bgColor} rounded-md p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <h2 className={`font-medium ${notification.textColor}`}>
                  {notification.title}
                </h2>
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
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default Announcement;
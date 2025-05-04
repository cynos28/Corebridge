'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  date: string;
  message: string;
  type: string;
  bgColor: string;
  textColor: string;
  meetingLink?: string;
  class: string;
}

interface AnnouncementContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications when provider mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/meetings');
        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }
        const data = await response.json();
        
        // Transform meetings data into notifications format
        const meetingNotifications = data.data.map((meeting: any) => ({
          id: meeting._id,
          title: meeting.title,
          date: new Date(meeting.meetingDate).toLocaleDateString(),
          message: `Meeting scheduled from ${meeting.startTime} to ${meeting.endTime}. ${meeting.description}`,
          type: 'meeting',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          meetingLink: meeting.meetingLink,
          class: meeting.class,
        }));

        setNotifications(meetingNotifications);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchNotifications();
  }, []);

  const addNotification = async (notification: Notification) => {
    try {
      setNotifications((prev) => [...prev, notification]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  return (
    <AnnouncementContext.Provider value={{ notifications, addNotification }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncementContext = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncementContext must be used within an AnnouncementProvider');
  }
  return context;
};
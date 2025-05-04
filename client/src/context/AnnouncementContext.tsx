'use client';

import React, { createContext, useContext, useState } from 'react';

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

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);
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
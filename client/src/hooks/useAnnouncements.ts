'use client';

import { useState } from 'react';

interface Announcement {
  id: string;
  title: string;
  date: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  bgColor: string;
  textColor: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = {
      ...announcement,
      id: Date.now().toString(),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    announcements,
    addAnnouncement,
    removeAnnouncement,
  };
};
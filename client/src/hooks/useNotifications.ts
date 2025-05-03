'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  date: string;
  message: string;
  type: 'meeting' | 'announcement';
  bgColor: string;
  textColor: string;
  meetingLink?: string;
  class?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
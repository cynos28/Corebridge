'use client';

import React, { createContext, useContext } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationContext = createContext<ReturnType<typeof useNotifications> | undefined>(undefined);

export const AnnouncementProvider = ({ children }: { children: React.ReactNode }) => {
  const notificationUtils = useNotifications();
  
  return (
    <NotificationContext.Provider value={notificationUtils}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useAnnouncementContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useAnnouncementContext must be used within an AnnouncementProvider');
  }
  return context;
};
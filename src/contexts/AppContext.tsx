// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { Notification } from "../types/Types";

interface AppContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
  notifications: Notification[];
  addNotification: (msg: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // Correction ici

  const addNotification = (msg: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      utilisateurId: "current-user-id",
      titre: "Nouvelle notification",
      message: msg,
      type: 'info',
      lue: false,
      dateCreation: new Date()
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, lue: true }
          : notification
      )
    );
  };

  return (
    <AppContext.Provider value={{ loading, setLoading, notifications, addNotification, markNotificationAsRead }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp doit être utilisé dans un AppProvider");
  return context;
};
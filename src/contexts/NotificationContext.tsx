import React, { createContext, useContext, useState, useCallback } from "react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration ?? 5000,
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto remove after duration
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    [removeNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification({ type: "success", title, message, duration });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification({ type: "error", title, message, duration: duration ?? 8000 });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification({ type: "warning", title, message, duration });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification({ type: "info", title, message, duration });
    },
    [addNotification]
  );

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

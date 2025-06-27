import React from "react";
import { useNotifications, Notification } from "@/contexts/NotificationContext";

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotifications();

  const iconMap = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const colorMap = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const buttonColorMap = {
    success: "text-green-600 hover:text-green-800",
    error: "text-red-600 hover:text-red-800",
    warning: "text-yellow-600 hover:text-yellow-800",
    info: "text-blue-600 hover:text-blue-800",
  };

  return (
    <div
      className={`ring-opacity-5 pointer-events-auto mb-3 w-full max-w-sm transform overflow-hidden rounded-lg shadow-lg ring-1 ring-black transition-all duration-300 ease-in-out ${colorMap[notification.type]}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg">{iconMap[notification.type]}</span>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="mt-1 text-xs opacity-90">{notification.message}</p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      action.variant === "primary"
                        ? "bg-opacity-20 hover:bg-opacity-30 bg-white"
                        : "underline hover:no-underline"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className={`inline-flex rounded-md ${buttonColorMap[notification.type]} focus:ring-2 focus:ring-offset-2 focus:outline-none`}
              onClick={() => removeNotification(notification.id)}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications, clearAll } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {/* Clear All Button */}
        {notifications.length > 1 && (
          <button
            onClick={clearAll}
            className="focus:ring-burgundy pointer-events-auto mb-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Clear All ({notifications.length})
          </button>
        )}

        {/* Notifications */}
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

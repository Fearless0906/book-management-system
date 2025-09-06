import { BellRing } from "lucide-react";

export function NotificationsCenter() {
  const notifications = [
    {
      id: 1,
      message: "Book 'The Great Gatsby' is overdue by John Doe.",
      type: "alert",
    },
    { id: 2, message: "New user Jane Smith registered.", type: "info" },
    { id: 3, message: "System update scheduled for 2 AM.", type: "info" },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h3>
        <BellRing className="h-6 w-6 text-gray-500" />
      </div>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500">No new notifications.</div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

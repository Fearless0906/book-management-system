import { BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/types/types";
import { Button } from "@/components/ui/button"; // New import
import { XCircle } from "lucide-react"; // New import

interface NotificationsCenterProps {
  notifications: Activity[];
  loading: boolean;
  onClearNotification: (id: string) => void;
}

export function NotificationsCenter({
  notifications,
  loading,
  onClearNotification,
}: NotificationsCenterProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Notifications</CardTitle>
          <BellRing className="h-6 w-6 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            Loading notifications...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-hidden border-0 shadow-none px-4 py-2">
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No new notifications.
          </div>
        ) : (
          <ul className="space-y-1">
            {notifications.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
              >
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {activity.item}
                  </h3>
                  <span className="text-xs text-gray-800 dark:text-gray-200">
                    {activity.action}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClearNotification(activity.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <XCircle className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

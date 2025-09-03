import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Activity } from '@/types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecentActivityProps {
  activities: Activity[];
  onViewAll?: () => void;
}

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function RecentActivity({ activities, onViewAll }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'borrow':
        return '📚';
      case 'return':
        return '✅';
      case 'register':
        return '👤';
      case 'add':
        return '➕';
      default:
        return '📋';
    }
  };

  return (
    <Card className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Latest library activities</p>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No recent activities found.
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
              <div className="flex-shrink-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activity.user?.image ?? undefined} />
                  <AvatarFallback>{activity.user?.name?.[0] ?? getActivityIcon(activity.type)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.action}</span>
                  {activity.item && <span className="text-blue-600 dark:text-blue-400"> {activity.item}</span>}
                  {activity.user && <span> by {activity.user.name}</span>}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeSince(new Date(activity.createdAt))}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-between text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={onViewAll}>
          View all activity
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
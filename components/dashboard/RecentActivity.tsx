import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  action: string;
  item: string;
  user: string;
  time: string;
  avatar: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
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
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Latest library activities</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.action}</span>
                {activity.item && <span className="text-blue-600 dark:text-blue-400"> {activity.item}</span>}
                {activity.user && <span> by {activity.user}</span>}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-between" onClick={onViewAll}>
          View all activity
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
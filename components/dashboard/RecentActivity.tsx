import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity } from "@/types/types";
import { BookUp, BookDown, UserPlus, Plus, LucideIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton"; // New import

interface RecentActivityProps {
  activities: Activity[];
  onViewAll?: () => void;
  loading: boolean; // New prop
}

const ActivityIcon = ({ type }: { type: string }) => {
  const iconMap: { [key: string]: LucideIcon } = {
    borrow: BookUp,
    return: BookDown,
    register: UserPlus,
    add: Plus,
  };
  const Icon = iconMap[type] || Plus;
  return <Icon className="h-5 w-5 text-white" />;
};

export function RecentActivity({ activities, onViewAll, loading }: RecentActivityProps) { // Destructure loading
  return (
    <Card className="p-6 rounded-2xl border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        <Button onClick={onViewAll} variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
          View All
        </Button>
      </div>
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-16">
            No recent activities found.
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gray-900/20 dark:bg-white/20 flex items-center justify-center">
                  <ActivityIcon type={activity.type} />
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute top-10 left-5 h-full w-px bg-gray-300 dark:bg-gray-600"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {activity.action} on <span className="font-semibold text-gray-900 dark:text-white">{activity.item}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

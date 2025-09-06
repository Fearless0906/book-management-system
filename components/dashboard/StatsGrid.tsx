import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // New import

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  description: string;
}

interface StatsGridProps {
  stats: StatItem[];
  loading: boolean; // New prop
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-6 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.label}
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white leading-none pt-5">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gray-900/10 dark:bg-white/10">
              <stat.icon className="h-6 w-6 text-gray-800 dark:text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

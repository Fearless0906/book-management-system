import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  description: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-6 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
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
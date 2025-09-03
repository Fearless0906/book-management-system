import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  color: string;
  description: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-20`}>
              <stat.icon className={`h-6 w-6 text-white`} style={{ color: stat.color.replace('bg-', '').replace('-500', '') }} />
            </div>
            {stat.change && (
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20' 
                  : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
              }`}>
                {stat.change}
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
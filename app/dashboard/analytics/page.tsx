"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  TrendingUp,
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">Insights and detailed reports</p>
        </div>
        
        <EmptyState
          title="Analytics Dashboard"
          description="View detailed reports and analytics about your library usage."
          icon={TrendingUp}
          buttonText="View Reports"
          onButtonClick={() => console.log('View reports clicked')}
        />
      </div>
    </DashboardLayout>
  );
}
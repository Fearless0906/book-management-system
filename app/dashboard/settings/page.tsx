"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  Settings,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure your system</p>
        </div>
        
        <EmptyState
          title="System Settings"
          description="Configure your book management system settings."
          icon={Settings}
          buttonText="Open Settings"
          onButtonClick={() => console.log('Open settings clicked')}
        />
      </div>
    </DashboardLayout>
  );
}
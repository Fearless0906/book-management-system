"use client";

import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  Plus,
  UserCheck,
} from 'lucide-react';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage library users and permissions</p>
          </div>
          <Button onClick={() => console.log('Add user clicked')}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        
        <EmptyState
          title="User Management"
          description="Manage library users, permissions, and borrowing history."
          icon={UserCheck}
          buttonText="Get Started"
          onButtonClick={() => console.log('Get started clicked')}
        />
      </div>
    </DashboardLayout>
  );
}
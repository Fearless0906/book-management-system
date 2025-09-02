"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Home,
  Menu,
  Bell,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logout } from '@/components/Logout';
import { UserProfile } from '@/components/UserProfile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview and statistics', href: '/dashboard' },
    { id: 'books', label: 'Books', icon: BookOpen, description: 'Manage your book collection', href: '/dashboard/books' },
    { id: 'users', label: 'Users', icon: Users, description: 'User management', href: '/dashboard/users' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Reports and insights', href: '/dashboard/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'System configuration', href: '/dashboard/settings' },
  ];

  const currentPage = sidebarItems.find(item => item.href === pathname);
  const showSearch = pathname !== '/dashboard';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out bg-sidebar border-r border-border flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">BMS</h1>
                <p className="text-xs text-sidebar-foreground/70">Book Management System</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 p-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex flex-col items-start">
                    <span>{item.label}</span>
                    <span className="text-xs text-sidebar-foreground/70">{item.description}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-border">
          <Logout collapsed={sidebarCollapsed} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-8 w-8"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {currentPage?.label || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {showSearch && (
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search..." className="pl-10 w-64" />
                </div>
              )}
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
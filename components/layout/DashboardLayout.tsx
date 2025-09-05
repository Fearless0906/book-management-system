"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Home,
  Menu,
  Bell,
  Search,
  Activity,
  BookCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logout } from "@/components/Logout";
import { UserProfile } from "@/components/UserProfile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "books", label: "Books", icon: BookOpen, href: "/dashboard/books" },
    {
      id: "borrowed",
      label: "Borrowed",
      icon: BookCheck,
      href: "/dashboard/borrowed",
    }, // New item
    {
      id: "overdue",
      label: "Overdue",
      icon: Clock,
      href: "/dashboard/overdue",
    }, // New item
    { id: "users", label: "Users", icon: Users, href: "/dashboard/users" },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
      href: "/dashboard/activity",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  const currentPage = sidebarItems.find((item) => item.href === pathname);
  const showSearch = pathname !== "/dashboard";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans antialiased">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-64"} transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
            sidebarCollapsed ? "flex justify-center" : ""
          }`}
        >
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : ""
            } space-x-3`}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white truncate">
                  BMS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Book Management System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 p-3 overflow-y-auto">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  sidebarCollapsed ? "justify-center" : "space-x-3"
                } ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    pathname === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                  }`}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Logout collapsed={sidebarCollapsed} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-9 w-9 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentPage?.label || "Dashboard"}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {showSearch && (
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              </Button>

              <UserProfile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

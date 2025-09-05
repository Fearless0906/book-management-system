"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MostBorrowedBooksChart } from "@/components/analytics/MostBorrowedBooksChart";
import { BookStatusDistributionChart } from "@/components/analytics/BookStatusDistributionChart";
import { ActivityOverTimeChart } from "@/components/analytics/ActivityOverTimeChart";
import useFetch from "@/helpers/useFetch";
import {
  fetchMostBorrowedBooks,
  fetchBookStatusDistribution,
  fetchActivityOverTime,
  fetchDashboardStats,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Users, ArrowRightLeft, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const { data: mostBorrowedData, loading: mostBorrowedLoading } = useFetch(
    fetchMostBorrowedBooks,
    []
  );

  const { data: statusDistributionData, loading: statusDistributionLoading } =
    useFetch(fetchBookStatusDistribution, []);

  const { data: activityOverTimeData, loading: activityOverTimeLoading } =
    useFetch(fetchActivityOverTime, []);

  const { data: statsData, loading: statsLoading } = useFetch(fetchDashboardStats);

  const stats = useMemo(() => {
    if (!statsData) return [];
    return [
      {
        title: "Total Books",
        value: statsData.totalBooks,
        icon: Book,
        description: "Total books in the library",
      },
      {
        title: "Total Users",
        value: statsData.totalUsers,
        icon: Users,
        description: "Total registered users",
      },
      {
        title: "Borrowed Books",
        value: statsData.borrowedBooks,
        icon: ArrowRightLeft,
        description: "Books currently borrowed",
      },
      {
        title: "Overdue Books",
        value: statsData.overdueBooks,
        icon: AlertTriangle,
        description: "Books past their due date",
      },
    ];
  }, [statsData]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Analytics Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-1/2 mb-1" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))
            : stats.map((stat, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MostBorrowedBooksChart
              data={mostBorrowedData || []}
              loading={mostBorrowedLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <BookStatusDistributionChart
              data={statusDistributionData || []}
              loading={statusDistributionLoading}
            />
          </div>
          <div className="lg:col-span-3">
            <ActivityOverTimeChart
              data={activityOverTimeData || []}
              loading={activityOverTimeLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

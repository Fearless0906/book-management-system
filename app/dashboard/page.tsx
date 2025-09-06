"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Library, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentBooks } from "@/components/dashboard/RecentBooks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { OverdueBooksSection } from "@/components/dashboard/OverdueBooksSection";
import { PopularBooksSection } from "@/components/dashboard/PopularBooksSection";
import { UserQuickActions } from "@/components/dashboard/UserQuickActions";
import { BookAvailabilityChart } from "@/components/dashboard/BookAvailabilityChart";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import useFetch from "@/helpers/useFetch";
import { fetchBooks, fetchActivities, fetchDashboardStats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
  const router = useRouter();

  const fetchRecentBooksCallback = useCallback(() => fetchBooks({ limit: 5, sort: 'createdAt:desc' }), []);
  const fetchActivitiesCallback = useCallback(() => fetchActivities({ limit: 5 }), []);

  const { data: statsData, loading: statsLoading, error: statsError } = useFetch(fetchDashboardStats);
  const { data: booksData, loading: booksLoading, error: booksError } = useFetch(fetchRecentBooksCallback);
  const { data: activitiesData, loading: activitiesLoading, error: activitiesError } = useFetch(fetchActivitiesCallback);

  const stats = useMemo(() => {
    if (!statsData) return [];

    return [
      {
        label: "Total Books",
        value: statsData.totalBooks.toString(),
        icon: BookOpen,
        color: "bg-blue-500",
        description: "Books in collection",
      },
      {
        label: "Active Users",
        value: statsData.totalUsers.toString(),
        icon: Users,
        color: "bg-green-500",
        description: "Registered users",
      },
      {
        label: "Books Borrowed",
        value: statsData.borrowedBooks.toString(),
        icon: Library,
        color: "bg-purple-500",
        description: "Currently borrowed",
      },
      {
        label: "Overdue Books",
        value: statsData.overdueBooks.toString(),
        icon: Clock,
        color: "bg-red-500",
        description: "Need attention",
      },
    ];
  }, [statsData]);

  const recentBooks = useMemo(() => {
    if (!booksData) return [];
    return booksData.books;
  }, [booksData]);

  const isLoading = statsLoading || booksLoading || activitiesLoading;
  const hasError = statsError || booksError || activitiesError;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 p-6">
          <WelcomeSection
            title="Welcome back to BMS!"
            subtitle="Here is what is happening with your library today."
            onAddBook={() => {}}
            onAddUser={() => {}}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-36 rounded-lg" />
            <Skeleton className="h-36 rounded-lg" />
            <Skeleton className="h-36 rounded-lg" />
            <Skeleton className="h-36 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (hasError) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="m-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {statsError?.message || booksError?.message || activitiesError?.message || "Failed to load dashboard data."}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <WelcomeSection
          title="Welcome back to BMS!"
          subtitle="Here is what is happening with your library today."
          onAddBook={() => router.push("/dashboard/books?add=true")}
          onAddUser={() => router.push("/dashboard/users?add=true")}
        />
        <StatsGrid stats={stats} />
        <OverdueBooksSection />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RecentBooks
            books={recentBooks}
            onAddBook={() => router.push("/dashboard/books?add=true")}
            onViewAll={() => router.push("/dashboard/books")}
          />
          <BookAvailabilityChart />
          <RecentActivity
            activities={activitiesData?.activities || []}
            onViewAll={() => router.push("/dashboard/activity")}
          />
          <PopularBooksSection />
        </div>
        <UserQuickActions />
        <QuickLinks />
      </div>
    </DashboardLayout>
  );
}
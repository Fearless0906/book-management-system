"use client";

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Library, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentBooks } from '@/components/dashboard/RecentBooks';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import useFetch from '@/helpers/useFetch';
import { fetchBooks, fetchUsers, fetchActivities } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const router = useRouter();

  const fetchBooksCallback = useCallback(() => fetchBooks({ limit: 1000 }), []);
  const fetchUsersCallback = useCallback(() => fetchUsers({ limit: 1000 }), []);
  const fetchActivitiesCallback = useCallback(() => fetchActivities({ limit: 5 }), []);

  const { data: booksData, loading: booksLoading, error: booksError } = useFetch(
    fetchBooksCallback
  );
  const { data: usersData, loading: usersLoading, error: usersError } = useFetch(
    fetchUsersCallback
  );
  const { data: activitiesData, loading: activitiesLoading, error: activitiesError } = useFetch(
    fetchActivitiesCallback
  );

  const stats = useMemo(() => {
    if (!booksData || !usersData) return [];

    const totalBooks = booksData.pagination.total;
    const activeUsers = usersData.pagination.total;
    const borrowedBooks = booksData.books.filter(
      (book) => book.status === 'Borrowed'
    ).length;
    const overdueBooks = booksData.books.filter(
      (book) => book.status === 'Borrowed' && book.dueDate && new Date(book.dueDate) < new Date()
    ).length;

    return [
      {
        label: 'Total Books',
        value: totalBooks.toString(),
        change: '',
        changeType: 'positive' as const,
        icon: BookOpen,
        color: 'bg-blue-500',
        description: 'Books in collection',
      },
      {
        label: 'Active Users',
        value: activeUsers.toString(),
        change: '',
        changeType: 'positive' as const,
        icon: Users,
        color: 'bg-green-500',
        description: 'Registered users',
      },
      {
        label: 'Books Borrowed',
        value: borrowedBooks.toString(),
        change: '',
        changeType: 'positive' as const,
        icon: Library,
        color: 'bg-purple-500',
        description: 'Currently borrowed',
      },
      {
        label: 'Overdue Books',
        value: overdueBooks.toString(),
        change: '',
        changeType: 'negative' as const,
        icon: Clock,
        color: 'bg-red-500',
        description: 'Need attention',
      },
    ];
  }, [booksData, usersData]);

  const recentBooks = useMemo(() => {
    if (!booksData) return [];
    return [...booksData.books]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [booksData]);

  if (booksLoading || usersLoading || activitiesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 p-6">
          <WelcomeSection
            title="Welcome back to BMS!"
            subtitle="Here is what is happening with your library today."
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

  if (booksError || usersError || activitiesError) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="m-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {booksError?.message || usersError?.message || activitiesError?.message || 'Failed to load dashboard data.'}
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
        />
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RecentBooks
            books={recentBooks}
            onAddBook={() => router.push('/dashboard/books?add=true')}
            onViewAll={() => router.push('/dashboard/books')}
          />
          <RecentActivity
            activities={activitiesData?.activities || []}
            onViewAll={() => router.push('/dashboard/activity')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

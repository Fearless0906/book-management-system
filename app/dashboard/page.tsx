"use client";

import {
  BookOpen,
  Users,
  Library,
  Clock,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentBooks } from '@/components/dashboard/RecentBooks';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function Dashboard() {
  const stats = [
    { 
      label: 'Total Books', 
      value: '2,847', 
      change: '+12%', 
      changeType: 'positive' as const,
      icon: BookOpen, 
      color: 'bg-blue-500',
      description: 'Books in collection'
    },
    { 
      label: 'Active Users', 
      value: '1,234', 
      change: '+8%', 
      changeType: 'positive' as const,
      icon: Users, 
      color: 'bg-green-500',
      description: 'Registered users'
    },
    { 
      label: 'Books Borrowed', 
      value: '456', 
      change: '+15%', 
      changeType: 'positive' as const,
      icon: Library, 
      color: 'bg-purple-500',
      description: 'Currently borrowed'
    },
    { 
      label: 'Overdue Books', 
      value: '23', 
      change: '-5%', 
      changeType: 'negative' as const,
      icon: Clock, 
      color: 'bg-red-500',
      description: 'Need attention'
    },
  ];

  const recentBooks = [
    { 
      id: 1,
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      status: 'Available', 
      rating: 4.5,
      category: 'Classic Literature',
      borrowedBy: null
    },
    { 
      id: 2,
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      status: 'Borrowed', 
      rating: 4.8,
      category: 'Classic Literature',
      borrowedBy: 'John Doe'
    },
    { 
      id: 3,
      title: '1984', 
      author: 'George Orwell', 
      status: 'Available', 
      rating: 4.7,
      category: 'Dystopian Fiction',
      borrowedBy: null
    },
    { 
      id: 4,
      title: 'Pride and Prejudice', 
      author: 'Jane Austen', 
      status: 'Reserved', 
      rating: 4.6,
      category: 'Romance',
      borrowedBy: 'Jane Smith'
    },
  ];

  const recentActivity = [
    { 
      id: 1,
      type: 'borrow',
      action: 'Book borrowed', 
      item: 'The Catcher in the Rye', 
      user: 'John Doe', 
      time: '2 hours ago',
      avatar: 'JD'
    },
    { 
      id: 2,
      type: 'return',
      action: 'Book returned', 
      item: 'Harry Potter and the Sorcerer Stone', 
      user: 'Jane Smith', 
      time: '4 hours ago',
      avatar: 'JS'
    },
    { 
      id: 3,
      type: 'register',
      action: 'New user registered', 
      item: 'Mike Johnson', 
      user: '', 
      time: '6 hours ago',
      avatar: 'MJ'
    },
    { 
      id: 4,
      type: 'add',
      action: 'Book added', 
      item: 'The Hobbit', 
      user: 'Admin', 
      time: '1 day ago',
      avatar: 'AD'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <WelcomeSection 
          title="Welcome back to BMS!" 
          subtitle="Here is what is happening with your library today."
        />
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RecentBooks 
            books={recentBooks}
            onAddBook={() => console.log('Add book clicked')}
            onViewAll={() => console.log('View all books clicked')}
          />
          <RecentActivity 
            activities={recentActivity}
            onViewAll={() => console.log('View all activity clicked')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

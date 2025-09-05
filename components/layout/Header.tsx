"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserProfile } from '@/components/UserProfile';
import { ModeToggle } from "@/components/themeToggle";
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

export function Header({ title, showSearch = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-foreground">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          <ModeToggle />
          
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
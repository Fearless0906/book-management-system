"use client";

import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className = "" }: MainContentProps) {
  return (
    <main className={`flex-1 p-6 lg:p-8 ${className}`}>
      {children}
    </main>
  );
}
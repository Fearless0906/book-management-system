"use client";

import { SettingsPageLayout } from '@/components/layout/SettingsPageLayout';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { User } from '@/types/types';

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      // In a real application, you would fetch the full user object from your API
      // based on the session user ID or email.
      // For this example, we'll construct a basic user object.
      setUser({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || null,
        role: (session.user.role as "Admin" | "User") || "User",
        createdAt: '', // Placeholder
        updatedAt: '', // Placeholder
      });
    }
  }, [session]);

  if (!user) {
    return <div>Loading settings...</div>; // Or a skeleton loader
  }

  return <SettingsPageLayout user={user} />;
}

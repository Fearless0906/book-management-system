import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

export function UserQuickActions() {
  return (
    <Card className="p-6 rounded-2xl border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">User Management</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <Button asChild>
          <Link href="/dashboard/users?add=true">
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/users">
            <Users className="h-4 w-4 mr-2" />
            View All Users
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

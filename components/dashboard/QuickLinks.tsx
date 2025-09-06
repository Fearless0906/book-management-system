import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Users, Plus, ListChecks } from "lucide-react";

export function QuickLinks() {
  return (
    <Card className="p-6 rounded-2xl border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button asChild variant="outline">
          <Link href="/dashboard/books?add=true">
            <Plus className="h-4 w-4 mr-2" />
            Add New Book
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/books">
            <BookOpen className="h-4 w-4 mr-2" />
            Manage Books
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/borrowed">
            <ListChecks className="h-4 w-4 mr-2" />
            Borrowed Books
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/users">
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

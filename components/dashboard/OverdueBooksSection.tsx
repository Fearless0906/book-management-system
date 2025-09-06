import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OverdueBooksTable } from "@/components/tables/OverdueBooksTable";
import { Button } from "@/components/ui/button";
import { Book } from "@/types/types";
import useFetch from "@/helpers/useFetch";
import { fetchOverdueBooks } from "@/lib/api";
import Link from "next/link";

export function OverdueBooksSection() {
  const { data: overdueBooks, loading, error } = useFetch(fetchOverdueBooks);

  return (
    <Card className="p-6 rounded-2xl border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Overdue Books</CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
          <Link href="/dashboard/overdue">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-red-500">Failed to load overdue books.</div>
        ) : (
          <OverdueBooksTable books={overdueBooks || []} loading={loading} />
        )}
      </CardContent>
    </Card>
  );
}

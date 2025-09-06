import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book } from "@/types/types";
import { RecentAdditionsTable } from "@/components/tables/RecentAdditionsTable";

interface RecentBooksProps {
  books: Book[];
  onAddBook?: () => void;
  onViewAll?: () => void;
}

export function RecentBooks({ books, onAddBook, onViewAll }: RecentBooksProps) {
  return (
    <Card className="p-6 rounded-2xl border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Additions</h3>
        <Button onClick={onViewAll} variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
          View All
        </Button>
      </div>
      {books.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-16">
          No recent books found.
        </div>
      ) : (
        <RecentAdditionsTable
          books={books}
          loading={false} // Assuming books are already loaded here
        />
      )}
    </Card>
  );
}
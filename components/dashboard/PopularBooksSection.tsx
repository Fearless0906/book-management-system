import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Book } from "@/types/types";
import useFetch from "@/helpers/useFetch";
import { fetchMostBorrowedBooks } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function PopularBooksSection() {
  const { data: mostBorrowedBooks, loading, error } = useFetch(fetchMostBorrowedBooks);

  return (
    <Card className="p-6 rounded-2xl border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Popular Books</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load popular books.</div>
        ) : !mostBorrowedBooks || mostBorrowedBooks.length === 0 ? (
          <div className="text-center text-gray-500">No popular books found.</div>
        ) : (
          <ul className="space-y-2">
            {mostBorrowedBooks.map((book, index) => (
              <li key={index} className="flex justify-between items-center py-1">
                <span className="text-gray-800 dark:text-gray-200">{book.title}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{book.count} borrows</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

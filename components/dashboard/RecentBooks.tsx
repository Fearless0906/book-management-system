import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, ChevronRight } from 'lucide-react';
import { Book } from '@/types/types';

interface RecentBooksProps {
  books: Book[];
  onAddBook?: () => void;
  onViewAll?: () => void;
}

export function RecentBooks({ books, onAddBook, onViewAll }: RecentBooksProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Borrowed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Books</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest additions to your collection</p>
        </div>
        <Button variant="outline" size="sm" onClick={onAddBook} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600">
          Add Book
        </Button>
      </div>
      <div className="space-y-4">
        {books.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No recent books found.
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-base">{book.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{book.rating ?? 'N/A'}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{book.category}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(book.status)}`}>
                  {book.status}
                </span>
                {book.borrowedBy && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">by {book.borrowedBy}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-between text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={onViewAll}>
          View all books
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
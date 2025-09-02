import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, ChevronRight } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number;
  category: string;
  borrowedBy: string | null;
}

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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Books</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest additions to your collection</p>
        </div>
        <Button variant="outline" size="sm" onClick={onAddBook}>
          Add Book
        </Button>
      </div>
      <div className="space-y-4">
        {books.map((book) => (
          <div key={book.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">{book.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{book.rating}</span>
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
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-between" onClick={onViewAll}>
          View all books
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
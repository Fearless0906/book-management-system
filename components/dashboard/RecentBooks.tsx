import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book } from "@/types/types";

interface RecentBooksProps {
  books: Book[];
  onAddBook?: () => void;
  onViewAll?: () => void;
}

const BookCard = ({ book }: { book: Book }) => {
  const colors = [
    "bg-gradient-to-br from-blue-400 to-indigo-600",
    "bg-gradient-to-br from-green-400 to-teal-600",
    "bg-gradient-to-br from-yellow-400 to-orange-600",
    "bg-gradient-to-br from-pink-400 to-rose-600",
    "bg-gradient-to-br from-purple-400 to-violet-600",
  ];

  const colorClass = colors[book.title.length % colors.length];

  return (
    <div className={"flex-shrink-0 w-48 text-white rounded-lg p-4 flex flex-col justify-between h-64 shadow-lg transform hover:scale-105 transition-transform duration-300 " + colorClass}>
      <div>
        <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
        <p className="text-xs opacity-80 mt-1">{book.author}</p>
      </div>
      <div className="text-right">
        <span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
          {book.status}
        </span>
      </div>
    </div>
  );
};

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
        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-6 px-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </Card>
  );
}

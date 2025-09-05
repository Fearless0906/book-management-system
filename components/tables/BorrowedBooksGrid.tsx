"use client";

import { Book } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pencil, Trash, Undo } from "lucide-react";
import { format } from "date-fns";

interface BorrowedBooksGridProps {
  books: Book[];
  loading: boolean;
  onReturn: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onEdit: (book: Book) => void;
}

export function BorrowedBooksGrid({
  books,
  loading,
  onReturn,
  onDelete,
  onEdit,
}: BorrowedBooksGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return <div className="text-center h-32">No borrowed books found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <Card key={book.id} className={book.isOverdue ? "border-red-500" : ""}>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            <div className="mt-4">
              <p className="text-sm font-semibold">Borrowed At:</p>
              <p>{book.borrowedAt ? format(new Date(book.borrowedAt), "PPP") : "N/A"}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm font-semibold">Due Date:</p>
              <p className={book.isOverdue ? "text-red-500 font-semibold" : ""}>
                {book.dueDate ? format(new Date(book.dueDate), "PPP") : "N/A"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(book)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onReturn(book.id)}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(book.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

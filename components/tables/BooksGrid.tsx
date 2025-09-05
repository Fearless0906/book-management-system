"use client";

import { Book } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, Pencil, Trash, BookUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BooksGridProps {
  books: Book[];
  loading: boolean;
  onViewBook: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onBorrowBook: (book: Book) => void;
}

export function BooksGrid({
  books,
  loading,
  onViewBook,
  onEditBook,
  onDeleteBook,
  onBorrowBook,
}: BooksGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return <div className="text-center h-32">No books found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <Card key={book.id}>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </CardHeader>
          <CardContent>
            <Badge
              variant={book.status === "Available" ? "success" : "warning"}
            >
              {book.status}
            </Badge>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onViewBook(book)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEditBook(book)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onBorrowBook(book)}
              disabled={book.status !== "Available"}
            >
              <BookUp className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeleteBook(book.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

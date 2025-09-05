"use client";

import { Book } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash, Undo } from "lucide-react";
import { format } from "date-fns";

interface BorrowedBooksTableProps {
  books: Book[];
  loading: boolean;
  onReturn: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onEdit: (book: Book) => void;
}

export function BorrowedBooksTable({
  books,
  loading,
  onReturn,
  onDelete,
  onEdit,
}: BorrowedBooksTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Borrowed By</TableHead>
            <TableHead>Borrowed At</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : !books || books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-32">
                No borrowed books found
              </TableCell>
            </TableRow>
          ) : (
            books?.map((book) => (
              <TableRow key={book.id} className={book.isOverdue ? "bg-red-100 dark:bg-red-900/20" : ""}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.user?.name || "N/A"}</TableCell>
                <TableCell>
                  {book.borrowedAt
                    ? format(new Date(book.borrowedAt), "PPP")
                    : "N/A"}
                </TableCell>
                <TableCell className={book.isOverdue ? "text-red-500 font-semibold" : ""}>
                  {book.dueDate ? format(new Date(book.dueDate), "PPP") : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

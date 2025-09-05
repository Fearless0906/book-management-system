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
import { Loader2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface OverdueBooksTableProps {
  books: Book[];
  loading: boolean;
}

export function OverdueBooksTable({ books, loading }: OverdueBooksTableProps) {
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
            <TableHead>Days Overdue</TableHead>
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
                No overdue books found
              </TableCell>
            </TableRow>
          ) : (
            books?.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.user?.name || "N/A"}</TableCell>
                <TableCell>
                  {book.borrowedAt ? format(new Date(book.borrowedAt), "PPP") : "N/A"}
                </TableCell>
                <TableCell>
                  {book.dueDate ? format(new Date(book.dueDate), "PPP") : "N/A"}
                </TableCell>
                <TableCell className="font-bold text-red-500">
                  {book.dueDate ? differenceInDays(new Date(), new Date(book.dueDate)) : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddBookDialog, BookFormData } from "@/components/AddBookDialog";
import {
  Search,
  Download,
  Star,
  Edit2,
  Eye,
  Trash2,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import useFetch from "@/helpers/useFetch";
import { createBook, fetchBooks } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function BooksPage() {
  const {
    data: books,
    error: error,
    loading: loading,
    refetch,
  } = useFetch(fetchBooks);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = books ? Math.ceil(books.length / rowsPerPage) : 0;
  const paginatedBooks = books
    ? books.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];
  // Add new book
  const handleAddBook = async (bookData: BookFormData) => {
    try {
      const newBook = await createBook(bookData);

      await refetch();
      toast.success("Book added successfully");
      return newBook;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to add book";
      toast.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Book Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your library collection
            </p>
          </div>
          <AddBookDialog onAddBook={handleAddBook} />
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={refetch} disabled={loading}>
                <RefreshCcw
                  className={`h-4 w-4 transition-transform ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-gray-500"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-red-500"
                    >
                      Error: {error?.message}
                    </TableCell>
                  </TableRow>
                ) : !books || books.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-gray-500"
                    >
                      No books found. Add your first book to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBooks.map((book) => (
                    <TableRow
                      key={book.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {book.title}
                        </p>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {book.author}
                      </TableCell>

                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {book.isbn}
                      </TableCell>

                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {book.category}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center">
                          {book.rating ? (
                            <>
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                {book.rating}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No rating
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {book.pages}
                      </TableCell>

                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {book.publishedYear}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            book.status === "Available"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : book.status === "Borrowed"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {book.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Control */}
          {!loading && books && books.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

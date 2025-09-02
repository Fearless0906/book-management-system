"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddBookDialog, BookFormData } from "@/components/AddBookDialog";
import { Search, Download, Star } from "lucide-react";
import useFetch from "@/helpers/useFetch";
import { fetchBooks } from "@/lib/api";



export default function BooksPage() {
  // Fetch books from API
  const { data: books, error: error, loading: loading } = useFetch(fetchBooks);

  // Add new book
  const handleAddBook = async (bookData: BookFormData) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const newBook = await response.json();
      setBooks((prev) => [newBook, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add book");
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
            </div>
          </div>

        <div className="overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Book Details</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={5} className="py-8 text-center text-gray-500">
            Loading books...
          </TableCell>
        </TableRow>
      ) : error ? (
        <TableRow>
          <TableCell colSpan={5} className="py-8 text-center text-red-500">
            Error: {error?.message}
          </TableCell>
        </TableRow>
      ) : !books || books.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} className="py-8 text-center text-gray-500">
            No books found. Add your first book to get started!
          </TableCell>
        </TableRow>
      ) : (
        books.map((book) => (
          <TableRow
            key={book.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <TableCell>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {book.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {book.author}
                </p>
              </div>
            </TableCell>

            <TableCell className="text-gray-600 dark:text-gray-400">
              {book.category}
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
              <div className="flex items-center">
                {book.rating ? (
                  <>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {book.rating}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">No rating</span>
                )}
              </div>
            </TableCell>

            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</div>

        </div>
      </div>
    </DashboardLayout>
  );
}

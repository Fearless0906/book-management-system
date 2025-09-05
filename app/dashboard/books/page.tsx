"use client";

import { Book } from "@/types/types";
import { BookFormData, PaginatedResponse } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BooksTable } from "@/components/tables/BooksTable";
import { BooksGrid } from "@/components/tables/BooksGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBookDialog } from "@/components/modals/AddBookDialog";
import { ImportBooksDialog } from "@/components/modals/ImportBooksDialog";
import { Search, ListFilter, RefreshCcw, LayoutGrid, List } from "lucide-react";
import { createBook, updateBook, deleteBook, fetchBooks } from "@/lib/api";
import { toast } from "sonner";
import { ViewBookDialog } from "@/components/modals/ViewBookDialog";
import { EditBookDialog } from "@/components/modals/EditBookDialog";
import { BorrowBookDialog } from "@/components/modals/BorrowBookDialog"; // New import
import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import useFetch from "@/helpers/useFetch";

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("table");
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isViewBookOpen, setIsViewBookOpen] = useState(false);
  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [isBorrowBookOpen, setIsBorrowBookOpen] = useState(false); // New state
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const rowsPerPage = 10;

  const searchParams = useSearchParams();
  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchBooksCallback = useCallback(() => {
    return fetchBooks({
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch || undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
    });
  }, [currentPage, debouncedSearch, statusFilter]);

  const {
    data: booksData,
    loading,
    error,
    refetch,
  } = useFetch(fetchBooksCallback, [
    currentPage,
    debouncedSearch,
    statusFilter,
  ]);

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setIsAddBookOpen(true);
    }
  }, [searchParams]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const books = (booksData as PaginatedResponse<Book>)?.books || [];
  const { totalPages = 0 } =
    (booksData as PaginatedResponse<Book>)?.pagination || {};

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      await createBook(bookData);
      await refetch();
      toast.success("Book added successfully");
      setIsAddBookOpen(false);
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book");
    }
  };

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setIsViewBookOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditBookOpen(true);
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      const bookData = {
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn || undefined,
        category: updatedBook.category,
        description: updatedBook.description || undefined,
        publishedYear: updatedBook.publishedYear || undefined,
        publisher: updatedBook.publisher || undefined,
        pages: updatedBook.pages || undefined,
        status: updatedBook.status,
        rating: updatedBook.rating || undefined,
      };
      await updateBook(updatedBook.id, bookData);
      await refetch();
      toast.success("Book updated successfully");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    toast.error("Are you sure you want to delete this book?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteBook(bookId);
            await refetch();
            toast.success("Book deleted successfully");
          } catch (error) {
            console.error("Error deleting book:", error);
            toast.error("Failed to delete book");
          }
        },
      },
    });
  };

  const handleBorrowBook = (book: Book) => {
    // New function
    setSelectedBook(book);
    setIsBorrowBookOpen(true);
  };

  const handleConfirmBorrow = async (
    bookId: string,
    userId: string,
    borrowedAt: Date, // Added borrowedAt
    dueDate: Date
  ) => {
    // New function
    try {
      await updateBook(bookId, {
        status: "Borrowed",
        borrowedBy: userId,
        borrowedAt: borrowedAt, // Use borrowedAt from dialog
        dueDate: dueDate,
      });
      await refetch();
      toast.success("Book borrowed successfully");
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error("Failed to borrow book");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ListFilter className="h-4 w-4" />
                  Status: {statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Available">
                    Available
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Borrowed">
                    Borrowed
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Reserved">
                    Reserved
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCcw
                className={`h-4 w-4 transition-transform ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <div className="flex gap-2">
            <ImportBooksDialog onAddBook={handleAddBook} />
            <AddBookDialog
              onAddBook={handleAddBook}
              open={isAddBookOpen}
              onOpenChange={setIsAddBookOpen}
            />
            <div className="flex gap-2">
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-500">Error loading books</div>
        ) : (
          <>
            {view === "table" ? (
              <BooksTable
                books={books}
                loading={loading}
                onViewBook={handleViewBook}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
                onBorrowBook={handleBorrowBook}
              />
            ) : (
              <BooksGrid
                books={books}
                loading={loading}
                onViewBook={handleViewBook}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
                onBorrowBook={handleBorrowBook}
              />
            )}

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {selectedBook && (
          <>
            <ViewBookDialog
              book={selectedBook}
              open={isViewBookOpen}
              onOpenChange={setIsViewBookOpen}
            />
            <EditBookDialog
              book={selectedBook}
              open={isEditBookOpen}
              onOpenChange={setIsEditBookOpen}
              onSave={handleUpdateBook}
            />
            <BorrowBookDialog // New dialog
              book={selectedBook}
              open={isBorrowBookOpen}
              onOpenChange={setIsBorrowBookOpen}
              onBorrow={handleConfirmBorrow}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

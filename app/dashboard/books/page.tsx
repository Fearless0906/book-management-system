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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBookDialog } from "@/components/modals/AddBookDialog";
import { ImportBooksDialog } from "@/components/modals/ImportBooksDialog";
import { Search, ListFilter, RefreshCcw } from "lucide-react";
import { createBook, updateBook, deleteBook } from "@/lib/api";
import { toast } from "sonner";
import { ViewBookDialog } from "@/components/modals/ViewBookDialog";
import { EditBookDialog } from "@/components/modals/EditBookDialog";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDebounce } from "@/hooks/useDebounce";
import { useBooks } from "@/hooks/useBooks";
import { useSearchParams } from "next/navigation";

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isViewBookOpen, setIsViewBookOpen] = useState(false);
  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const rowsPerPage = 10;

  const searchParams = useSearchParams();
  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data: booksData,
    isLoading,
    isFetching,
    isError: error,
    refetch,
  } = useBooks({
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
  }) as {
    data: PaginatedResponse<Book> | undefined;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
  };

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setIsAddBookOpen(true);
    }
  }, [searchParams]);

  // Show loading state during initial load and subsequent fetches
  const loading = isLoading || isFetching;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const books = booksData?.books || [];
  const { totalPages = 0 } = booksData?.pagination || {};

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
            <AddBookDialog onAddBook={handleAddBook} open={isAddBookOpen} onOpenChange={setIsAddBookOpen} />
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-500">Error loading books</div>
        ) : (
          <>
            <BooksTable
              books={books}
              loading={loading}
              onViewBook={handleViewBook}
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
            />

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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
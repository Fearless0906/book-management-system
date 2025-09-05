"use client";

import { Book, PaginatedResponse } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import useFetch from "@/helpers/useFetch";
import { BorrowedBooksTable } from "@/components/tables/BorrowedBooksTable";
import { updateBook, deleteBook } from "@/lib/api";
import { BorrowBookDialog } from "@/components/modals/BorrowBookDialog";

export default function BorrowedBooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditBorrowOpen, setIsEditBorrowOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const rowsPerPage = 10;

  const fetchBorrowedBooksCallback = useCallback(() => {
    return fetch(`/api/borrowed?page=${currentPage}&limit=${rowsPerPage}`).then(
      (res) => res.json()
    );
  }, [currentPage, rowsPerPage]);

  const {
    data: borrowedBooksData,
    loading,
    error,
    refetch,
  } = useFetch(fetchBorrowedBooksCallback, [currentPage, rowsPerPage]);

  const borrowedBooks =
    (borrowedBooksData as PaginatedResponse<Book>)?.books || [];
  const { totalPages = 0 } =
    (borrowedBooksData as PaginatedResponse<Book>)?.pagination || {};

  useEffect(() => {
    if (error) {
      toast.error("Failed to load borrowed books.");
    }
  }, [error]);

  const handleReturnBook = async (bookId: string) => {
    try {
      await updateBook(bookId, { status: "Available" });
      await refetch();
      toast.success("Book returned successfully");
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book");
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

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditBorrowOpen(true);
  };

  const handleConfirmBorrow = async (
    bookId: string,
    userId: string,
    borrowedAt: Date,
    dueDate: Date
  ) => {
    try {
      await updateBook(bookId, {
        status: "Borrowed",
        borrowedBy: userId,
        borrowedAt: borrowedAt,
        dueDate: dueDate,
      });
      await refetch();
      toast.success("Borrowed book details updated successfully");
    } catch (error) {
      console.error("Error updating borrowed book:", error);
      toast.error("Failed to update borrowed book");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Borrowed Books</h2>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCcw
              className={`h-4 w-4 transition-transform ${
                loading ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>

        {error ? (
          <div className="text-center text-red-500">
            Error loading borrowed books.
          </div>
        ) : (
          <>
            <BorrowedBooksTable
              books={borrowedBooks}
              loading={loading}
              onReturn={handleReturnBook}
              onDelete={handleDeleteBook}
              onEdit={handleEditBook}
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
          <BorrowBookDialog
            book={selectedBook}
            open={isEditBorrowOpen}
            onOpenChange={setIsEditBorrowOpen}
            onBorrow={handleConfirmBorrow}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Book, User } from "@/types/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BorrowedBooksTable } from "@/components/tables/BorrowedBooksTable";
import { BorrowedBooksGrid } from "@/components/tables/BorrowedBooksGrid";
import { toast } from "sonner";
import useFetch from "@/helpers/useFetch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { updateBook, deleteBook } from "@/lib/api";
import { BorrowBookDialog } from "@/components/modals/BorrowBookDialog";

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState("table");
  const [isEditBorrowOpen, setIsEditBorrowOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchUserCallback = useCallback(() => {
    return fetch(`/api/users/${userId}`).then((res) => res.json());
  }, [userId]);

  const { data: userData, error: userError } = useFetch(fetchUserCallback, [
    userId,
  ]);

  const fetchUserBooksCallback = useCallback(() => {
    return fetch(`/api/users/${userId}/books`).then((res) => res.json());
  }, [userId]);

  const {
    data: userBooksData,
    loading: booksLoading,
    error: booksError,
    refetch: refetchBooks,
  } = useFetch(fetchUserBooksCallback, [userId]);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (userError) {
      toast.error("Failed to load user details.");
    }
    if (booksError) {
      toast.error("Failed to load user books.");
    }
  }, [userError, booksError]);

  const borrowedBooks = userBooksData?.books || [];

  const handleReturnBook = async (bookId: string) => {
    try {
      await updateBook(bookId, { status: "Available" });
      await refetchBooks();
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
            await refetchBooks();
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
      await refetchBooks();
      toast.success("Borrowed book details updated successfully");
    } catch (error) {
      console.error("Error updating borrowed book:", error);
      toast.error("Failed to update borrowed book");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user?.name || "..."}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Borrowed Books</h2>
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
          {view === "table" ? (
            <BorrowedBooksTable
              books={borrowedBooks}
              loading={booksLoading}
              onReturn={handleReturnBook}
              onDelete={handleDeleteBook}
              onEdit={handleEditBook}
            />
          ) : (
            <BorrowedBooksGrid
              books={borrowedBooks}
              loading={booksLoading}
              onReturn={handleReturnBook}
              onDelete={handleDeleteBook}
              onEdit={handleEditBook}
            />
          )}
        </div>

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

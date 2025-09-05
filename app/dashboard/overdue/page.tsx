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
import { OverdueBooksTable } from "@/components/tables/OverdueBooksTable"; // Will create this next

export default function OverdueBooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchOverdueBooksCallback = useCallback(() => {
    return fetch(`/api/overdue?page=${currentPage}&limit=${rowsPerPage}`).then(
      (res) => res.json()
    );
  }, [currentPage, rowsPerPage]);

  const {
    data: overdueBooksData,
    loading,
    error,
    refetch,
  } = useFetch(fetchOverdueBooksCallback, [currentPage, rowsPerPage]);

  const overdueBooks =
    (overdueBooksData as PaginatedResponse<Book>)?.books || [];
  const { totalPages = 0 } =
    (overdueBooksData as PaginatedResponse<Book>)?.pagination || {};

  useEffect(() => {
    if (error) {
      toast.error("Failed to load overdue books.");
    }
  }, [error]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Overdue Books</h2>
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
            Error loading overdue books.
          </div>
        ) : (
          <>
            <OverdueBooksTable
              books={overdueBooks}
              loading={loading}
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
      </div>
    </DashboardLayout>
  );
}

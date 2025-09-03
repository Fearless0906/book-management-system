"use client";

import { Activity, PaginatedActivityResponse } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useActivities } from "@/hooks/useActivities";
import { ActivityTable } from "@/components/tables/ActivityTable";

export default function ActivityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const {
    data: activitiesData,
    isLoading,
    isFetching,
    isError: error,
    refetch,
  } = useActivities({
    page: currentPage,
    limit: rowsPerPage,
  });

  // Show loading state during initial load and subsequent fetches
  const loading = isLoading || isFetching;

  const activities = activitiesData?.activities || [];
  const { totalPages = 0 } = activitiesData?.pagination || {};

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Activity Log</h1>
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

        {error ? (
          <div className="text-center text-red-500">Error loading activities</div>
        ) : (
          <>
            <ActivityTable activities={activities} loading={loading} />

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
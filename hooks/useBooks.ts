"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBooks, type FetchBooksOptions } from "@/lib/api";

export function useBooks(options: FetchBooksOptions = {}) {
  return useQuery({
    queryKey: ["books", options],
    queryFn: () => fetchBooks(options),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

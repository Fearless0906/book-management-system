"use client";

import { useQuery } from "@tanstack/react-query";
import { type FetchUsersOptions } from "@/types/types";
import { fetchUsers } from "@/lib/api";

export function useUsers(options: FetchUsersOptions = {}) {
  return useQuery({
    queryKey: ["users", options],
    queryFn: () => fetchUsers(options),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

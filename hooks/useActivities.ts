"use client";

import { useQuery } from "@tanstack/react-query";
import { type FetchActivitiesOptions } from "@/types/types";
import { fetchActivities } from "@/lib/api";

export function useActivities(options: FetchActivitiesOptions = {}) {
  return useQuery({
    queryKey: ["activities", options],
    queryFn: () => fetchActivities(options),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

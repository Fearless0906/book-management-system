"use client";

import { Activity } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityTableProps {
  activities: Activity[];
  loading: boolean;
}

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function ActivityTable({
  activities,
  loading,
}: ActivityTableProps) {
  return (
    <div className="rounded-md border relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && (!activities || activities.length === 0) ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-32">
                No activities found
              </TableCell>
            </TableRow>
          ) : (
            activities?.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={activity.user?.image ?? undefined} />
                      <AvatarFallback>{activity.user?.name?.[0] ?? 'A'}</AvatarFallback>
                    </Avatar>
                    {activity.user?.name ?? "Unknown"}
                  </div>
                </TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.item}</TableCell>
                <TableCell>{timeSince(new Date(activity.createdAt))}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

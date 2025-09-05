"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, PaginatedUserResponse } from "@/types/types"; // Import PaginatedUserResponse
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useCallback } from "react"; // Add useCallback
import { toast } from "sonner";
import { fetchUsers } from "@/lib/api";
import useFetch from "@/helpers/useFetch"; // Import useFetch
import { Calendar } from "lucide-react";

interface BorrowBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onBorrow: (
    bookId: string,
    userId: string,
    borrowedAt: Date,
    dueDate: Date
  ) => void; // Modified
}

const formSchema = z.object({
  userId: z.string().min(1, { message: "Please select a user." }),
  borrowedAt: z.string().min(1, { message: "Please select a borrowed date." }), // New
  dueDate: z.string().min(1, { message: "Please select a due date." }),
});

export function BorrowBookDialog({
  open,
  onOpenChange,
  book,
  onBorrow,
}: BorrowBookDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      borrowedAt: new Date().toISOString().split("T")[0], // Set default to today
      dueDate: "",
    },
  });

  // Use useFetch for fetching users
  const fetchUsersCallback = useCallback(() => {
    return fetchUsers({ page: 1, limit: 1000 }); // Fetch all users
  }, []);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useFetch(fetchUsersCallback, []);

  const users = (usersData as PaginatedUserResponse)?.users || [];

  useEffect(() => {
    if (open) {
      refetchUsers();
    }
  }, [open, refetchUsers]);

  useEffect(() => {
    if (usersError) {
      toast.error("Failed to load users for borrowing.");
    }
  }, [usersError]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!book) return;
    onBorrow(
      book.id,
      values.userId,
      new Date(values.borrowedAt),
      new Date(values.dueDate)
    ); // Modified
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow Book</DialogTitle>
          <DialogDescription>
            Assign &quot;{book?.title}&quot; to a user and set a due date.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={usersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            usersLoading ? "Loading users..." : "Select a user"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField // New FormField for borrowedAt
              control={form.control}
              name="borrowedAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Borrowed At</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        type="date"
                        {...field}
                        className="pr-10
                          [&::-webkit-calendar-picker-indicator]:opacity-0
                          [&::-webkit-calendar-picker-indicator]:absolute
                          [&::-webkit-calendar-picker-indicator]:right-3
                          [&::-webkit-calendar-picker-indicator]:top-1/2
                          [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                          [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        type="date"
                        {...field}
                        className="pr-10
                          [&::-webkit-calendar-picker-indicator]:opacity-0
                          [&::-webkit-calendar-picker-indicator]:absolute
                          [&::-webkit-calendar-picker-indicator]:right-3
                          [&::-webkit-calendar-picker-indicator]:top-1/2
                          [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                          [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={usersLoading}>
              Borrow Book
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Book } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

interface ViewBookDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewBookDialog({
  book,
  open,
  onOpenChange,
}: ViewBookDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>Book details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Author</h4>
              <p className="text-sm text-gray-500">{book.author}</p>
            </div>
            <div>
              <h4 className="font-medium">Category</h4>
              <p className="text-sm text-gray-500">{book.category}</p>
            </div>
          </div>
          {book.isbn && (
            <div>
              <h4 className="font-medium">ISBN</h4>
              <p className="text-sm text-gray-500">{book.isbn}</p>
            </div>
          )}
          {book.description && (
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-gray-500">{book.description}</p>
            </div>
          )}
          <div className="grid grid-cols-4 gap-4">
            {book.publishedYear && (
              <div>
                <h4 className="font-medium">Published Year</h4>
                <p className="text-sm text-gray-500">{book.publishedYear}</p>
              </div>
            )}
            {book.publisher && (
              <div>
                <h4 className="font-medium">Publisher</h4>
                <p className="text-sm text-gray-500">{book.publisher}</p>
              </div>
            )}
            {book.pages && (
              <div>
                <h4 className="font-medium">Pages</h4>
                <p className="text-sm text-gray-500">{book.pages}</p>
              </div>
            )}
            <div>
              <h4 className="font-medium">Status</h4>
              <p className="text-sm text-gray-500">{book.status}</p>
            </div>
          </div>
          {book.rating && (
            <div>
              <h4 className="font-medium">Rating</h4>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-500">{book.rating}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

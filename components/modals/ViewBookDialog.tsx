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
import { Star, BookOpen, Calendar, Hash, BookCopy, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="relative h-30 bg-gradient-to-b from-primary/10 to-background">
          <DialogHeader className="absolute inset-x-0 bottom-0 px-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-semibold tracking-tight mb-1 line-clamp-1">
                  {book.title}
                </DialogTitle>
                <DialogDescription className="text-base font-medium text-muted-foreground">
                  by {book.author}
                </DialogDescription>
              </div>
              <Badge
                variant={
                  book.status === "Available"
                    ? "success"
                    : book.status === "Borrowed"
                      ? "warning"
                      : "info"
                }
                className="mt-1"
              >
                {book.status}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-2 space-y-2">
          {/* Book Summary Section */}
          {book.description && (
            <Card className="border-none bg-muted/30 shadow-none">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {book.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Rating Section */}
          {book.rating && (
            <div className="flex items-center justify-start">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4 transition-colors",
                      i < book.rating!
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/25"
                    )}
                  />
                ))}
                <span className="text-sm font-medium ml-1.5 text-muted-foreground">
                  {book.rating}/5
                </span>
              </div>
            </div>
          )}

          {/* Book Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none bg-muted/30 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <BookOpen className="h-4 w-4" />
                  <h4 className="text-sm font-medium">Details</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span>{book.category}</span>
                  </div>
                  {book.pages && (
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-muted-foreground">Length</span>
                      <span>{book.pages} pages</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-muted/30 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <h4 className="text-sm font-medium">Publication</h4>
                </div>
                <div className="space-y-2">
                  {book.publishedYear && (
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-muted-foreground">Year</span>
                      <span>{book.publishedYear}</span>
                    </div>
                  )}
                  {book.publisher && (
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-muted-foreground">Publisher</span>
                      <span className="text-right">{book.publisher}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ISBN Section */}
          {book.isbn && (
            <div className="flex items-center gap-2 justify-start text-sm text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span className="font-mono">{book.isbn}</span>
            </div>
          )}
        </div>

        <Separator className="mb-0" />

        <DialogFooter className="px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

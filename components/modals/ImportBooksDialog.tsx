"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload } from "lucide-react";
import Papa from "papaparse";
import { BookFormData } from "./AddBookDialog";

interface ImportBooksDialogProps {
  onAddBook: (book: BookFormData) => void;
}

export function ImportBooksDialog({ onAddBook }: ImportBooksDialogProps) {
  const [open, setOpen] = useState(false);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        try {
          if (results.errors.length > 0) {
            console.error("CSV Parsing Errors:", results.errors);
            throw new Error("Error parsing CSV file");
          }

          const rows = results.data;
          if (!Array.isArray(rows) || rows.length < 2) {
            throw new Error(
              "Invalid CSV format: File must have headers and at least one data row"
            );
          }

          // Get headers and convert to lowercase for easier matching
          const headers: string[] = rows[0].map((header: string) =>
            header.toLowerCase().trim()
          );
          console.log("CSV Headers:", headers); // Debug log

          // Find the indices for important columns
          const titleIndex = headers.indexOf("title");
          const authorIndex = headers.indexOf("author");
          const categoryIndex = headers.indexOf("category");

          // Look for rating in the 3rd or 4th column, or by header name
          let ratingIndex = headers.findIndex((h: string) =>
            h.includes("rating")
          );
          if (ratingIndex === -1) {
            // If no rating header found, use column 3 or 4 (index 2 or 3)
            ratingIndex = headers.length > 3 ? 3 : 2;
          }
          console.log("Rating column index:", ratingIndex); // Debug log

          // Remove header row
          const dataRows = rows.slice(1);

          const books: BookFormData[] = dataRows.map((row: string[]) => {
            // Try to get rating from the designated column
            const ratingValue = row[ratingIndex];
            const rating: number | undefined =
              ratingValue && !isNaN(parseFloat(ratingValue))
                ? Math.min(Math.max(parseFloat(ratingValue), 0), 5) // Ensure rating is between 0 and 5
                : undefined;

            if (rating !== undefined) {
              console.log(`Parsed rating ${ratingValue} to ${rating}`); // Debug log
            }

            // Find other column indices
            const isbnIndex = headers.indexOf("isbn");
            const descriptionIndex = headers.indexOf("description");
            const publishedYearIndex = headers.findIndex(
              (h: string) => h.includes("year") || h.includes("published")
            );
            const publisherIndex = headers.indexOf("publisher");
            const pagesIndex = headers.indexOf("pages");
            const statusIndex = headers.indexOf("status");

            const status: string =
              statusIndex !== -1 && row[statusIndex]
                ? row[statusIndex].trim()
                : "Available";

            // Build book object
            const book: BookFormData = {
              title: row[titleIndex]?.toString().trim() || "",
              author: row[authorIndex]?.toString().trim() || "",
              category: row[categoryIndex]?.toString().trim() || "",
              rating,
              isbn: isbnIndex !== -1 ? row[isbnIndex]?.toString().trim() : "",
              description:
                descriptionIndex !== -1
                  ? row[descriptionIndex]?.toString().trim()
                  : "",
              publishedYear:
                publishedYearIndex !== -1 && row[publishedYearIndex]
                  ? parseInt(row[publishedYearIndex].toString())
                  : undefined,
              publisher:
                publisherIndex !== -1
                  ? row[publisherIndex]?.toString().trim()
                  : "",
              pages:
                pagesIndex !== -1 && row[pagesIndex]
                  ? parseInt(row[pagesIndex].toString())
                  : undefined,
              status: (status.toLowerCase() === "borrowed"
                ? "Borrowed"
                : status.toLowerCase() === "reserved"
                  ? "Reserved"
                  : "Available") as "Available" | "Borrowed" | "Reserved",
            };

            // Log parsed book for debugging
            console.log("Parsed book:", book);

            return book;
          });

          const validBooks: BookFormData[] = books.filter(
            (b) => b.title && b.author && b.category
          );

          if (validBooks.length === 0) {
            alert(
              "CSV must contain at least one valid row with Title, Author, and Category."
            );
            return;
          }

          validBooks.forEach((book: BookFormData) => onAddBook(book));
          setOpen(false);
        } catch (error) {
          console.error("Error processing CSV:", error);
          alert("Invalid CSV file format or no valid books found");
        }
      },
      error: (error: Error) => {
        console.error("Error reading file:", error);
        alert("Error reading file");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Books
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Books</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple books at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="csv">CSV File</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Input
                  id="csv"
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <label htmlFor="csv" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-medium">
                        Drop your CSV file here or click to browse
                      </span>
                      <span className="text-xs text-muted-foreground">
                        The CSV should include columns for title, author,
                        category, and other optional fields
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import Papa from "papaparse";

interface AddBookDialogProps {
  onAddBook: (book: BookFormData) => void;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  description?: string;
  publishedYear?: number;
  publisher?: string;
  pages?: number;
}

export function AddBookDialog({ onAddBook }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    publishedYear: undefined,
    publisher: "",
    pages: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.category) {
      alert("Please fill in all required fields (Title, Author, Category)");
      return;
    }

    onAddBook(formData);
    resetForm();
  };

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "publishedYear" || field === "pages"
          ? value === ""
            ? undefined
            : parseInt(value)
          : value,
    }));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) =>
        header.trim().toLowerCase().replace(/\s+/g, ""), // normalize headers
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.error("CSV Parsing Errors:", results.errors);
            throw new Error("Error parsing CSV file");
          }

          const rows = results.data as any[];

          const books: BookFormData[] = rows.map((row) => {
            // Normalize rating
            const rating =
              row.rating && !isNaN(parseFloat(row.rating))
                ? parseFloat(row.rating)
                : undefined;

            return {
              title: row.title?.trim() || "",
              author: row.author?.trim() || "",
              rating,
              isbn: row.isbn?.trim() || "",
              category: row.category?.trim() || "",
              description: row.description?.trim() || "",
              publishedYear: row.publishedyear
                ? parseInt(row.publishedyear)
                : undefined,
              publisher: row.publisher?.trim() || "",
              pages: row.pages ? parseInt(row.pages) : undefined,
            };
          });

          const validBooks = books.filter(
            (b) => b.title && b.author && b.category
          );

          if (validBooks.length === 0) {
            alert(
              "CSV must contain at least one valid row with Title, Author, and Category."
            );
            return;
          }

          // Add the books
          validBooks.forEach((book) => onAddBook(book));
          resetForm();
        } catch (error) {
          console.error("Error parsing CSV:", error);
          alert("Invalid CSV file format or no valid books found");
        }
      },
      error: (error) => {
        console.error("Error reading file:", error);
        alert("Error reading file");
      },
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      description: "",
      publishedYear: undefined,
      publisher: "",
      pages: undefined,
    });
    setImportMode(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {importMode ? "Import Books" : "Add New Book"}
          </DialogTitle>
          <DialogDescription>
            {importMode
              ? "Upload a CSV file to import multiple books at once."
              : "Add a new book to your library collection. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        {importMode ? (
          <div className="space-y-4">
            <Label htmlFor="csv">Upload CSV File</Label>
            <Input
              id="csv"
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter book title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      handleInputChange("author", e.target.value)
                    }
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange("isbn", e.target.value)}
                    placeholder="Enter ISBN"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    placeholder="e.g., Fiction, Science, History"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of the book"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input
                    id="publishedYear"
                    type="number"
                    value={formData.publishedYear || ""}
                    onChange={(e) =>
                      handleInputChange("publishedYear", e.target.value)
                    }
                    placeholder="2023"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) =>
                      handleInputChange("publisher", e.target.value)
                    }
                    placeholder="Publisher name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages || ""}
                    onChange={(e) => handleInputChange("pages", e.target.value)}
                    placeholder="300"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Book</Button>
            </DialogFooter>
          </form>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setImportMode((prev) => !prev)}
          >
            {importMode ? "Switch to Manual Entry" : "Import from CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

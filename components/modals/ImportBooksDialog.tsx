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
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Sparkles,
  BookOpen,
} from "lucide-react";
import Papa from "papaparse";
import { BookFormData } from "./AddBookDialog";

interface ImportBooksDialogProps {
  onAddBook: (book: BookFormData) => void;
}

export function ImportBooksDialog({ onAddBook }: ImportBooksDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find((file) =>
      file.name.toLowerCase().endsWith(".csv")
    );
    if (csvFile) {
      processFile(csvFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setImportResult(null);

    // Simulate progress during parsing
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        clearInterval(progressInterval);
        setProgress(100);

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

          // Find the indices for important columns
          const titleIndex = headers.indexOf("title");
          const authorIndex = headers.indexOf("author");
          const categoryIndex = headers.indexOf("category");

          // Look for rating in the 3rd or 4th column, or by header name
          let ratingIndex = headers.findIndex((h: string) =>
            h.includes("rating")
          );
          if (ratingIndex === -1) {
            ratingIndex = headers.length > 3 ? 3 : 2;
          }

          // Remove header row
          const dataRows = rows.slice(1);
          const errors: string[] = [];
          let successCount = 0;

          const books: BookFormData[] = dataRows
            .map((row: string[], index: number) => {
              try {
                // Try to get rating from the designated column
                const ratingValue = row[ratingIndex];
                const rating: number | undefined =
                  ratingValue && !isNaN(parseFloat(ratingValue))
                    ? Math.min(Math.max(parseFloat(ratingValue), 0), 5)
                    : undefined;

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
                  isbn:
                    isbnIndex !== -1 ? row[isbnIndex]?.toString().trim() : "",
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

                // Validate required fields
                if (!book.title || !book.author || !book.category) {
                  errors.push(
                    `Row ${index + 2}: Missing required fields (title, author, or category)`
                  );
                  return null;
                }

                successCount++;
                return book;
              } catch (error) {
                errors.push(
                  `Row ${index + 2}: ${error instanceof Error ? error.message : "Unknown error"}`
                );
                return null;
              }
            })
            .filter((book): book is BookFormData => book !== null);

          // Add books to the system
          books.forEach((book: BookFormData) => onAddBook(book));

          setImportResult({
            success: successCount,
            errors: errors.slice(0, 10), // Limit to first 10 errors
          });

          // Auto-close if successful and no errors
          if (successCount > 0 && errors.length === 0) {
            setTimeout(() => {
              setOpen(false);
              resetState();
            }, 2000);
          }
        } catch (error) {
          console.error("Error processing CSV:", error);
          setImportResult({
            success: 0,
            errors: [
              error instanceof Error ? error.message : "Unknown error occurred",
            ],
          });
        }

        setIsProcessing(false);
      },
      error: (error: Error) => {
        clearInterval(progressInterval);
        setIsProcessing(false);
        setImportResult({
          success: 0,
          errors: [`File reading error: ${error.message}`],
        });
      },
    });
  };

  const resetState = () => {
    setProgress(0);
    setImportResult(null);
    setIsProcessing(false);
    setIsDragOver(false);
  };

  const downloadTemplate = () => {
    const csvContent = `title,author,category,rating,isbn,description,publishedYear,publisher,pages,status
"The Great Gatsby","F. Scott Fitzgerald","Fiction",4.2,"978-0-7432-7356-5","A classic American novel",1925,"Scribner",180,"Available"
"To Kill a Mockingbird","Harper Lee","Fiction",4.5,"978-0-06-112008-4","A gripping tale of racial injustice",1960,"J.B. Lippincott",281,"Available"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 duration-300" />
          <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
          Import Books
          <Sparkles className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Button>
      </DialogTrigger>

      <DialogContent
        showOverlay={true}
        className="sm:max-w-[650px] p-0 overflow-hidden"
      >
        <div className="p-6 pb-2">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Import Books
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Upload a CSV file to import multiple books at once
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-4">
          {!isProcessing && !importResult && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${
                  isDragOver
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                      <Upload
                        className={`h-8 w-8 text-primary transition-transform duration-300 ${
                          isDragOver ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                    </div>
                    {isDragOver && (
                      <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {isDragOver
                        ? "Drop your CSV file here"
                        : "Drop your CSV file here or click to browse"}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      CSV should include columns: title, author, category, and
                      other optional fields like rating, isbn, description, etc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Download */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Need a template?</p>
                    <p className="text-xs text-muted-foreground">
                      Download a sample CSV file to get started
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadTemplate}
                  className="hover:bg-background/80"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="space-y-6 py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin border-t-primary" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium">Processing your file...</p>
                  <p className="text-sm text-muted-foreground">
                    Parsing and validating book data
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          {/* Results State */}
          {importResult && (
            <div className="space-y-4 py-4">
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  importResult.success > 0
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {importResult.success > 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium">
                    {importResult.success > 0
                      ? `Successfully imported ${importResult.success} books!`
                      : "Import failed"}
                  </p>
                  {importResult.errors.length > 0 && (
                    <p className="text-sm opacity-90">
                      {importResult.errors.length} error
                      {importResult.errors.length !== 1 ? "s" : ""} encountered
                    </p>
                  )}
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <p className="text-sm font-medium text-muted-foreground">
                    Errors:
                  </p>
                  {importResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-red-50 rounded text-sm text-red-700 border border-red-100"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="hover:bg-background/80"
          >
            {importResult?.success ? "Close" : "Cancel"}
          </Button>
          {importResult &&
            importResult.success === 0 &&
            importResult.errors.length > 0 && (
              <Button
                onClick={() => {
                  resetState();
                }}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Try Again
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

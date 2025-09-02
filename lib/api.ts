import { BookFormData } from "@/components/AddBookDialog";
import { Book } from "@/types/types";

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const data = await response.json();

    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

export const createBook = async (bookData: BookFormData): Promise<Book> => {
  const response = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    throw new Error("Failed to add book");
  }

  return response.json();
};

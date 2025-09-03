import { Book } from "@/types/types";

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  description?: string;
  publishedYear?: number;
  publisher?: string;
  pages?: number;
  status?: string;
  rating?: number;
}

export interface PaginatedResponse<T> {
  books: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchBooksOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const fetchBooks = async ({
  page = 1,
  limit = 10,
  search,
  status,
}: FetchBooksOptions = {}): Promise<PaginatedResponse<Book>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
    });

    const response = await fetch(`/api/books?${params}`);
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

export const updateBook = async (
  bookId: string,
  bookData: Partial<BookFormData>
): Promise<Book> => {
  const response = await fetch("/api/books", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...bookData, id: bookId }),
  });

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return response.json();
};

export const deleteBook = async (bookId: string): Promise<void> => {
  const response = await fetch(`/api/books?id=${bookId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
};

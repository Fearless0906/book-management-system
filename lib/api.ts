import { Book } from "@/types/types";

export const fetchBooks = async (): Promise<Book[]> => {
    try {
      const response = await fetch('/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();

      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };
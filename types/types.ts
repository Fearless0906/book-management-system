export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  category: string;
  description: string | null;
  publishedYear: number | null;
  publisher: string | null;
  pages: number | null;
  rating: number | null;
  status: "Available" | "Borrowed" | "Reserved";
  borrowedBy: string | null;
  borrowedAt: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
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
  rating?: number;
  status?: "Available" | "Borrowed" | "Reserved";
}
export interface CsvRow {
  title?: string;
  author?: string;
  rating?: string;
  isbn?: string;
  category?: string;
  description?: string;
  publishedyear?: string;
  publisher?: string;
  pages?: string;
  status?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

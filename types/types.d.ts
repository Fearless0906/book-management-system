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
  isOverdue?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
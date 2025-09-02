export interface Book {
  id: string;
  title: string;
  author: string;
  status: string;
  rating: number | null;
  category: string;
  borrowedBy: string | null;
  isbn?: string | null;
  description?: string | null;
  publishedYear?: number | null;
  publisher?: string | null;
  pages?: number | null;
  createdAt: string;
  updatedAt: string;
}
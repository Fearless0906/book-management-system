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

export interface Activity {
  id: string;
  type: string;
  action: string;
  item: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  } | null;
}

export interface PaginatedActivityResponse {
  activities: Activity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchActivitiesOptions {
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "Admin" | "User";
  createdAt: string;
  updatedAt: string;
  books?: Book[];
  emailVerified: boolean;
  borrowedBooksCount?: number;
}

export type UserFormData = Omit<User, "id" | "createdAt" | "updatedAt" | "books">;

export interface PaginatedUserResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
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
  status?: "Available" | "Borrowed" | "Reserved";
}

export type BookFormData = Omit<Book, "id" | "createdAt" | "updatedAt" | "borrowedBy" | "borrowedAt" | "dueDate" | "user" | "isOverdue">;

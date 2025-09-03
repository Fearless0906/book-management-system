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

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

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

export interface UserFormData {
  name: string;
  email: string;
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
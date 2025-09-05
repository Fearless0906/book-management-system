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

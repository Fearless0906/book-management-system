import {
  Book,
  BookFormData,
  PaginatedResponse,
  FetchBooksOptions,
  User,
  UserFormData,
  PaginatedUserResponse,
  FetchUsersOptions,
  Activity,
  FetchActivitiesOptions,
  PaginatedActivityResponse,
} from "@/types/types";

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
    credentials: "include",
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
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return response.json();
};

export const deleteBook = async (bookId: string): Promise<void> => {
  const response = await fetch(`/api/books?id=${bookId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
};

// User management functions
export const fetchUsers = async ({
  page = 1,
  limit = 10,
  search,
}: FetchUsersOptions = {}): Promise<PaginatedUserResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await fetch(`/api/users?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();

    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

export const updateUser = async (
  userId: string,
  userData: Partial<UserFormData>
): Promise<User> => {
  const response = await fetch("/api/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...userData, id: userId }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};

export const deleteUser = async (userId: string): Promise<void> => {
  const response = await fetch(`/api/users?id=${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

export const fetchActivities = async ({
  page = 1,
  limit = 10,
}: FetchActivitiesOptions = {}): Promise<PaginatedActivityResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/activity?${params}`, { credentials: "include" });
    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }
    const data = await response.json();

    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

// Analytics functions
export const fetchMostBorrowedBooks = async (): Promise<{ title: string; count: number }[]> => {
  try {
    const response = await fetch("/api/analytics?type=most-borrowed-books");
    if (!response.ok) {
      throw new Error("Failed to fetch most borrowed books");
    }
    return response.json();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

export const fetchBookStatusDistribution = async (): Promise<{ status: string; count: number }[]> => {
  try {
    const response = await fetch("/api/analytics?type=book-status-distribution");
    if (!response.ok) {
      throw new Error("Failed to fetch book status distribution");
    }
    return response.json();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

export const fetchActivityOverTime = async (): Promise<{ date: string; count: number }[]> => {
  try {
    const response = await fetch("/api/analytics?type=activity-over-time");
    if (!response.ok) {
      throw new Error("Failed to fetch activity over time");
    }
    return response.json();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

export const fetchDashboardStats = async (): Promise<any> => {
  try {
    const response = await fetch("/api/stats");
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }
    return response.json();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

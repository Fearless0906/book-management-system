"use client";

import { useEffect, useState } from "react";
import { type InferSelectModel } from "drizzle-orm";
import { book, user } from "@/db/schema";

import { useDebounce } from "@/hooks/useDebounce";

import useFetch from "@/helpers/useFetch";
import { fetchGlobalSearchResults } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Import Input
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import Tabs
import { Search } from "lucide-react"; // Import Search icon
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Book = InferSelectModel<typeof book>;
type User = InferSelectModel<typeof user>;

interface SearchResults {
  books: Book[];
  users: User[];
}

interface GlobalSearchResultsOverlayProps {
  searchQuery: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchResultsOverlay({
  searchQuery,
  isOpen,
  onClose,
}: GlobalSearchResultsOverlayProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(internalSearchQuery, 500);
  const [filterType, setFilterType] = useState<"all" | "books" | "users">(
    "all"
  );

  // Sync prop searchQuery with internalSearchQuery when dialog opens or prop changes
  useEffect(() => {
    if (isOpen && searchQuery !== internalSearchQuery) {
      setInternalSearchQuery(searchQuery);
    }
  }, [isOpen, searchQuery]);

  const {
    data: results,
    loading,
    error,
  } = useFetch(
    () => fetchGlobalSearchResults(debouncedSearchQuery),
    [debouncedSearchQuery], // Re-fetch when debouncedSearchQuery changes
    isOpen && debouncedSearchQuery.length > 0 // Only fetch if dialog is open and query is not empty
  );

  useEffect(() => {
    if (!isOpen) {
      // Reset internal search query and filter when dialog closes
      setInternalSearchQuery("");
      setFilterType("all");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBooks =
    filterType === "all" || filterType === "books" ? results?.books : [];
  const filteredUsers =
    filterType === "all" || filterType === "users" ? results?.users : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Global Search</DialogTitle>
          <DialogDescription>
            Search for books and users across the system.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            value={internalSearchQuery}
            onChange={(e) => setInternalSearchQuery(e.target.value)}
          />
        </div>

        {/* <Tabs
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "all" | "books" | "users")
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </Tabs> */}

        {loading && <div className="p-4">Loading search results...</div>}
        {error && (
          <div className="p-4 text-red-500">Error: {error.message}</div>
        )}

        {!loading &&
          !error &&
          (!filteredBooks || filteredBooks.length === 0) &&
          (!filteredUsers || filteredUsers.length === 0) &&
          debouncedSearchQuery.length > 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No results found for &quot;{debouncedSearchQuery}&quot;.
            </div>
          )}

        {filteredBooks && filteredBooks.length > 0 && (
          <div className="space-y-4 mt-4">
            <h3 className="text-xl font-semibold">Books</h3>
            <div className="grid grid-cols-1 gap-2">
              {filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/dashboard/books?search=${encodeURIComponent(book.title || "")}`}
                  passHref
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{book.title}</span>
                      <span className="text-sm text-muted-foreground">
                        by {book.author}
                      </span>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredUsers && filteredUsers.length > 0 && (
          <div className="space-y-4 mt-4">
            <h3 className="text-xl font-semibold">Users</h3>
            <div className="grid grid-cols-1 gap-2">
              {filteredUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/dashboard/users/${user.id}`}
                  passHref
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

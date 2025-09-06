'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type InferSelectModel } from 'drizzle-orm';
import { book, user } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useFetch from '@/helpers/useFetch';
import { fetchGlobalSearchResults } from '@/lib/api';

type Book = InferSelectModel<typeof book>;
type User = InferSelectModel<typeof user>;

interface SearchResults {
  books: Book[];
  users: User[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  const { data: results, loading, error } = useFetch(
    () => fetchGlobalSearchResults(searchQuery),
    [searchQuery]
  );

  if (loading) {
    return <div className="p-4">Loading search results...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  const hasResults = results && (results.books.length > 0 || results.users.length > 0);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Search Results for &quot;{searchQuery}&quot;</h1>

      {!hasResults && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No results found for &quot;{searchQuery}&quot;.
          </CardContent>
        </Card>
      )}

      {results?.books.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.books.map((book) => (
                <Card key={book.id} className="p-4">
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                  <p className="text-sm text-muted-foreground">Category: {book.category}</p>
                  <Link href={`/dashboard/books?search=${encodeURIComponent(book.title || '')}`} passHref>
                    <Button variant="link" className="p-0 h-auto">View Details</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results?.users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.users.map((user) => (
                <Card key={user.id} className="p-4">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Link href={`/dashboard/users/${user.id}`} passHref>
                    <Button variant="link" className="p-0 h-auto">View Profile</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

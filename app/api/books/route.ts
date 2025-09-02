import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { book } from '@/db/schema';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, author, isbn, category, description, publishedYear, publisher, pages } = body;

    // Basic validation
    if (!title || !author || !category) {
      return NextResponse.json(
        { error: 'Title, author, and category are required' },
        { status: 400 }
      );
    }

    // Create new book
    const newBook = {
      id: nanoid(),
      title,
      author,
      isbn: isbn || null,
      category,
      description: description || null,
      publishedYear: publishedYear || null,
      publisher: publisher || null,
      pages: pages || null,
      rating: null,
      status: 'Available',
      borrowedBy: null,
      borrowedAt: null,
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [insertedBook] = await db.insert(book).values(newBook).returning();

    return NextResponse.json(insertedBook, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const books = await db.select().from(book);
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
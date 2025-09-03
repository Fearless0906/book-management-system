import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { book } from "@/db/schema";
import { nanoid } from "nanoid";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

const validateSession = async () => {
  try {
    await auth.handler(new Request("http://localhost"));
    return true;
  } catch {
    throw new Error("Unauthorized");
  }
};

export async function GET(request: NextRequest) {
  try {
    await validateSession();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    let whereClause;

    if (search || status) {
      const conditions = [];

      if (search) {
        const searchTerm = `%${search.toLowerCase()}%`;
        conditions.push(sql`(
          LOWER(${book.title}) LIKE ${searchTerm} OR 
          LOWER(${book.author}) LIKE ${searchTerm} OR 
          LOWER(COALESCE(${book.isbn}, '')) LIKE ${searchTerm} OR 
          LOWER(${book.category}) LIKE ${searchTerm} OR
          LOWER(COALESCE(${book.description}, '')) LIKE ${searchTerm}
        )`);
      }

      if (status) {
        conditions.push(eq(book.status, status));
      }

      whereClause = sql.join(conditions, sql` AND `);
    }

    const books = await db
      .select()
      .from(book)
      .where(whereClause || undefined)
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(book)
      .where(whereClause || undefined);

    const totalCount = Number(countResult?.count || 0);

    return NextResponse.json({
      books,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await validateSession();
    const body = await request.json();

    const {
      title,
      author,
      isbn,
      category,
      description,
      publishedYear,
      publisher,
      pages,
    } = body;

    // Basic validation
    if (!title || !author || !category) {
      return NextResponse.json(
        { error: "Title, author, and category are required" },
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
      status: "Available",
      borrowedBy: null,
      borrowedAt: null,
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [insertedBook] = await db.insert(book).values(newBook).returning();

    return NextResponse.json(insertedBook, { status: 201 });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await validateSession();
    const body = await request.json();

    const {
      id,
      title,
      author,
      isbn,
      category,
      description,
      publishedYear,
      publisher,
      pages,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Basic validation
    if (!title || !author || !category) {
      return NextResponse.json(
        { error: "Title, author, and category are required" },
        { status: 400 }
      );
    }

    // Check if book exists
    const existingBook = await db
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    if (!existingBook.length) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Update book
    const [updatedBook] = await db
      .update(book)
      .set({
        title,
        author,
        isbn: isbn || null,
        category,
        description: description || null,
        publishedYear: publishedYear || null,
        publisher: publisher || null,
        pages: pages || null,
        updatedAt: new Date(),
      })
      .where(eq(book.id, id))
      .returning();

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await validateSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Check if book exists and is not borrowed
    const [existingBook] = await db
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (existingBook.status === "Borrowed") {
      return NextResponse.json(
        { error: "Cannot delete a borrowed book" },
        { status: 400 }
      );
    }

    const [deletedBook] = await db
      .delete(book)
      .where(eq(book.id, id))
      .returning();

    return NextResponse.json(deletedBook);
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}

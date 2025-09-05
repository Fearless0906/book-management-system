import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { book, activity } from "@/db/schema";
import { nanoid } from "nanoid";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
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
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      rating,
      status = "Available",
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
      rating: rating || null,
      status: status,
      borrowedBy: null,
      borrowedAt: null,
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [insertedBook] = await db.insert(book).values(newBook).returning();

    await db.insert(activity).values({
      id: nanoid(),
      type: "add",
      action: "Book added",
      item: insertedBook.title,
      userId: session.user.id,
    });

    return NextResponse.json(insertedBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      rating,
      status,
      borrowedBy,
      borrowedAt,
      dueDate,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Check if book exists
    const [existingBook] = await db
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (isbn) updateData.isbn = isbn;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (publishedYear) updateData.publishedYear = publishedYear;
    if (publisher) updateData.publisher = publisher;
    if (pages) updateData.pages = pages;
    if (rating) updateData.rating = rating;
    if (status) updateData.status = status;
    if (borrowedBy) updateData.borrowedBy = borrowedBy;
    if (status === "Borrowed") {
      updateData.borrowedAt = borrowedAt ? new Date(borrowedAt) : new Date();
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    } else {
      updateData.borrowedAt = null;
      updateData.dueDate = null;
      updateData.borrowedBy = null;
    }

    // Update book
    const [updatedBook] = await db
      .update(book)
      .set(updateData)
      .where(eq(book.id, id))
      .returning();

    if (existingBook.status !== status) {
      if (status === "Borrowed") {
        await db.insert(activity).values({
          id: nanoid(),
          type: "borrow",
          action: "Book borrowed",
          item: updatedBook.title,
          userId: session.user.id,
        });
      } else if (status === "Available" && existingBook.status === "Borrowed") {
        await db.insert(activity).values({
          id: nanoid(),
          type: "return",
          action: "Book returned",
          item: updatedBook.title,
          userId: session.user.id,
        });
      }
    }

    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Check if book exists
    const [existingBook] = await db
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const [deletedBook] = await db
      .delete(book)
      .where(eq(book.id, id))
      .returning();

    return NextResponse.json(deletedBook);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
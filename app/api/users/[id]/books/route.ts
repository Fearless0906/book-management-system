import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { book } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const borrowedBooks = await db
      .select()
      .from(book)
      .where(and(eq(book.borrowedBy, userId), eq(book.status, "Borrowed")));

    const now = new Date();

    const booksWithOverdueStatus = borrowedBooks.map((b) => ({
      ...b,
      isOverdue: b.dueDate && new Date(b.dueDate) < now,
    }));

    return NextResponse.json({ books: booksWithOverdueStatus });
  } catch (error) {
    console.error("Error fetching user's books:", error);
    return NextResponse.json(
      { error: "Failed to fetch user's books" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { book, user } from "@/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    // Search books
    const books = await db
      .select()
      .from(book)
      .where(
        or(
          ilike(book.title, searchTerm),
          ilike(book.author, searchTerm),
          ilike(book.category, searchTerm),
          ilike(book.description, searchTerm)
        )
      )
      .limit(10); // Limit results for brevity

    // Search users
    const users = await db
      .select()
      .from(user)
      .where(
        or(
          ilike(user.name, searchTerm),
          ilike(user.email, searchTerm)
        )
      )
      .limit(10); // Limit results for brevity

    return NextResponse.json({
      books,
      users,
    });
  } catch (error) {
    console.error("Error during global search:", error);
    return NextResponse.json(
      { error: "Failed to perform global search" },
      { status: 500 }
    );
  }
}

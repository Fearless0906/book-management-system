import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { book, user } from "@/db/schema";
import { eq, sql, desc, and, lt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const overdueBooks = await db
      .select({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        borrowedAt: book.borrowedAt,
        dueDate: book.dueDate,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(book)
      .where(
        and(
          eq(book.status, "Borrowed"),
          lt(book.dueDate, new Date()) // dueDate is in the past
        )
      )
      .leftJoin(user, eq(book.borrowedBy, user.id))
      .orderBy(desc(book.dueDate))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(book)
      .where(
        and(
          eq(book.status, "Borrowed"),
          lt(book.dueDate, new Date())
        )
      );

    const totalCount = Number(countResult?.count || 0);

    return NextResponse.json({
      books: overdueBooks,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching overdue books:", error);
    return NextResponse.json(
      { error: "Failed to fetch overdue books" },
      { status: 500 }
    );
  }
}

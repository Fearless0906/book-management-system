import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { book, user, activity } from "@/db/schema";
import { count, and, lte, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const totalBooks = await db.select({ value: count(book.id) }).from(book);
    const totalUsers = await db.select({ value: count(user.id) }).from(user);
    const borrowedBooks = await db
      .select({ value: count(book.id) })
      .from(book)
      .where(eq(book.status, "Borrowed"));

    const overdueBooks = await db
      .select({ value: count(book.id) })
      .from(book)
      .where(
        and(eq(book.status, "Borrowed"), lte(book.dueDate, new Date()))
      );

    const stats = {
      totalBooks: totalBooks[0].value,
      totalUsers: totalUsers[0].value,
      borrowedBooks: borrowedBooks[0].value,
      overdueBooks: overdueBooks[0].value,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

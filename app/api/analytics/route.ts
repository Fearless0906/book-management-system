import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { activity, book } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "most-borrowed-books") {
      const mostBorrowed = await db
        .select({
          title: book.title,
          count: sql<number>`cast(count(${activity.id}) as integer)`,
        })
        .from(activity)
        .leftJoin(book, eq(activity.item, book.title))
        .where(eq(activity.type, "borrow"))
        .groupBy(book.title)
        .orderBy(sql`count DESC`)
        .limit(10);

      return NextResponse.json(mostBorrowed);
    }

    if (type === "book-status-distribution") {
      const statusDistribution = await db
        .select({
          status: book.status,
          count: sql<number>`cast(count(${book.id}) as integer)`,
        })
        .from(book)
        .groupBy(book.status);

      return NextResponse.json(statusDistribution);
    }

    if (type === "activity-over-time") {
      const activityOverTime = await db
        .select({
          date: sql<string>`date_trunc('day', ${activity.createdAt})`,
          count: sql<number>`cast(count(${activity.id}) as integer)`,
        })
        .from(activity)
        .groupBy(sql`date_trunc('day', ${activity.createdAt})`)
        .orderBy(sql`date_trunc('day', ${activity.createdAt})`);

      return NextResponse.json(activityOverTime);
    }

    return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

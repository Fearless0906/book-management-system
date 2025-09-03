import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { activity, user } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const activities = await db
      .select({
        id: activity.id,
        type: activity.type,
        action: activity.action,
        item: activity.item,
        createdAt: activity.createdAt,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(activity)
      .leftJoin(user, eq(activity.userId, user.id))
      .orderBy(desc(activity.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(activity);

    const totalCount = Number(countResult?.count || 0);

    return NextResponse.json({
      activities,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

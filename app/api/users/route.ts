import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { user, book, activity } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, ilike, not, sql } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

// Validation schemas
const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
});

const userUpdateSchema = userCreateSchema.extend({
  id: z.string().uuid("Invalid user ID"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const where = search
      ? and(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`)
        )
      : undefined;

    // Get total count
    const [countResult] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(user)
      .where(where);

    // Get paginated results with borrowed books count
    const users = await db
      .select({
        ...user,
        borrowedBooksCount: sql<number>`cast(count(${book.id}) as integer)`,
      })
      .from(user)
      .leftJoin(book, and(eq(user.id, book.borrowedBy), eq(book.status, "Borrowed")))
      .where(where)
      .groupBy(user.id)
      .limit(limit)
      .offset(offset);

    const totalCount = Number(countResult?.count || 0);

    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = userCreateSchema.parse(body);

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, validatedData.email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const [newUser] = await db
      .insert(user)
      .values({
        ...validatedData,
        id: crypto.randomUUID(),
      })
      .returning();

    await db.insert(activity).values({
      id: nanoid(),
      type: "register",
      action: "New user registered",
      item: newUser.name,
      userId: session.user.id,
    });

    return NextResponse.json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Validation error";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = userUpdateSchema.parse(body);

    // Check if email is taken by another user
    const [existingUser] = await db
      .select()
      .from(user)
      .where(
        and(
          eq(user.email, validatedData.email),
          not(eq(user.id, validatedData.id))
        )
      )
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already taken by another user" },
        { status: 400 }
      );
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        name: validatedData.name,
        email: validatedData.email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, validatedData.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Validation error";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    return NextResponse.json(deletedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
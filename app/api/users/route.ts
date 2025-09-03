import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { user, book } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, ilike, not, sql } from "drizzle-orm";
import { z } from "zod";

// Validation schemas
const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
});

const userUpdateSchema = userCreateSchema.extend({
  id: z.string().uuid("Invalid user ID"),
});

// Helper function to validate session
const validateSession = async () => {
  try {
    await auth.handler(new Request("http://localhost"));
    return true;
  } catch {
    throw new Error("Unauthorized");
  }
};

// Helper function to handle errors
const handleError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    const message = error.issues[0]?.message || "Validation error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error("Error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
};

export async function GET(request: Request) {
  try {
    await validateSession();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(user)
      .where(
        search
          ? and(
              ilike(user.name, `%${search}%`),
              ilike(user.email, `%${search}%`)
            )
          : undefined
      );

    // Get paginated results
    const users = await db
      .select()
      .from(user)
      .where(
        search
          ? and(
              ilike(user.name, `%${search}%`),
              ilike(user.email, `%${search}%`)
            )
          : undefined
      )
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
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await validateSession();

    const body = await request.json();
    const validatedData = userCreateSchema.parse(body);

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, validatedData.email))
      .limit(1);

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const [newUser] = await db
      .insert(user)
      .values({
        ...validatedData,
        id: crypto.randomUUID(),
      })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await validateSession();

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
      throw new Error("Email already taken by another user");
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
      throw new Error("User not found");
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await validateSession();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new Error("User ID is required");
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if user has any borrowed books
    const [hasBorrowedBooks] = await db
      .select({
        id: book.id,
      })
      .from(book)
      .where(eq(book.borrowedBy, id))
      .limit(1);

    if (hasBorrowedBooks) {
      throw new Error("Cannot delete user with borrowed books");
    }

    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    return NextResponse.json(deletedUser);
  } catch (error) {
    return handleError(error);
  }
}

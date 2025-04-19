import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import type { Todo } from "@/types/todo";
import { z } from "zod";

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
});

const updateTaskSchema = z.object({
  id: z.union([z.number(), z.string().transform(val => parseInt(val))]),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  completed: z.boolean(),
});

// GET all tasks or a single task
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the user from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    // Get single task
    const task = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    return NextResponse.json(task);
  }

  // Get all tasks
  const tasks = await prisma.todo.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tasks);
}

// POST new task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log('Found user:', JSON.stringify(user, null, 2));

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const data = await request.json();
    console.log('Request data:', JSON.stringify(data, null, 2));

    // Validate input data
    const validationResult = createTaskSchema.safeParse(data);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ errors: validationResult.error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the task with the correct user ID
    const task = await prisma.todo.create({
      data: {
        title: validationResult.data.title,
        userId: user.id, // Use the user ID from the database
      },
    });
    console.log('Created task:', JSON.stringify(task, null, 2));

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    
    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return new NextResponse(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : "Unknown error",
          details: error
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new NextResponse("Error creating task", { status: 500 });
  }
}

// DELETE task
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    // Delete the task with the correct user ID
    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId: user.id, // Use the user ID from the database
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    
    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return new NextResponse(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : "Unknown error",
          details: error
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new NextResponse("Error deleting task", { status: 500 });
  }
}

// PUT update task
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const data = await request.json();
    
    // Validate input data
    const validationResult = updateTaskSchema.safeParse(data);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ errors: validationResult.error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id, title, completed } = validationResult.data;

    // Update the task with the correct user ID
    const task = await prisma.todo.update({
      where: {
        id: typeof id === 'string' ? parseInt(id) : id,
        userId: user.id, // Use the user ID from the database
      },
      data: {
        title,
        completed,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    
    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return new NextResponse(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : "Unknown error",
          details: error
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new NextResponse("Error updating task", { status: 500 });
  }
} 
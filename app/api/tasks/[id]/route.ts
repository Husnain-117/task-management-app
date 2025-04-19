import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const task = await prisma.todo.findUnique({
    where: {
      id: parseInt(params.id),
      userId: session.user?.email as string,
    },
  });

  if (!task) {
    return new NextResponse("Task not found", { status: 404 });
  }

  return NextResponse.json(task);
} 
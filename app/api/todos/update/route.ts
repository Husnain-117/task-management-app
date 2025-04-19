import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const completed = formData.get("completed") === "on";

  const todo = await prisma.todo.update({
    where: {
      id: parseInt(id),
      userId: session.user?.email as string,
    },
    data: {
      title,
      completed,
    },
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
} 
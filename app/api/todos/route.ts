import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;

  const todo = await prisma.todo.create({
    data: {
      title,
      userId: session.user?.email as string,
    },
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export async function DELETE(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  await prisma.todo.delete({
    where: {
      id: parseInt(id),
      userId: session.user?.email as string,
    },
  });

  return new NextResponse(null, { status: 204 });
} 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const progress = await prisma.progress.findMany({
    where: { userId },
    select: { resourceId: true, completedAt: true },
  });
  return NextResponse.json(progress);
}

export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const { resourceId, completed } = await req.json();

  if (completed) {
    await prisma.progress.create({
      data: { userId, resourceId },
    });
  } else {
    await prisma.progress.deleteMany({
      where: { userId, resourceId },
    });
  }

  return NextResponse.json({ success: true });
}

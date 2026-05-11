import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const niche = await prisma.niche.findUnique({
    where: { id },
    include: { resources: { orderBy: { createdAt: "asc" } } },
  });
  if (!niche) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(niche);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const niche = await prisma.niche.update({ where: { id }, data: body });
  return NextResponse.json(niche);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.niche.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

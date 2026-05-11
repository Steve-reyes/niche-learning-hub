import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const nicheId = url.searchParams.get("nicheId");
  const category = url.searchParams.get("category");
  const level = url.searchParams.get("level");
  const search = url.searchParams.get("search");

  const where: any = {};
  if (nicheId) where.nicheId = nicheId;
  if (category) where.category = category;
  if (level) where.level = level;
  if (search) where.OR = [
    { title: { contains: search } },
    { niche: { name: { contains: search } } },
  ];

  const resources = await prisma.resource.findMany({
    where,
    include: { niche: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const body = await req.json();
  const resource = await prisma.resource.create({ data: body });
  return NextResponse.json(resource, { status: 201 });
}

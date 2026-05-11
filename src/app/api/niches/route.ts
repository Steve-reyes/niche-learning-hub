import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const niches = await prisma.niche.findMany({
    include: { _count: { select: { resources: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(niches);
}

export async function POST(req: Request) {
  const body = await req.json();
  const niche = await prisma.niche.create({
    data: {
      id: body.id,
      name: body.name,
      icon: body.icon,
      color: body.color,
      tag: body.tag,
    },
  });
  return NextResponse.json(niche, { status: 201 });
}

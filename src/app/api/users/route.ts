import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        _count: { select: { progress: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  try {
    const user = await prisma.user.create({
      data: { username, email, password: hash },
    });
    return NextResponse.json({ id: user.id, username: user.username, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Username or email already taken" }, { status: 409 });
  }
}
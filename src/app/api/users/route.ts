import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  try {
    const user = await prisma.user.create({
      data: { username, email, password: hash },
    });
    return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Username or email already taken" }, { status: 409 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const user = await prisma.user.findUnique({
    where: { username, password: hash },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  if (user.disabled) {
    return NextResponse.json({ error: "Account disabled" }, { status: 403 });
  }

  const res = NextResponse.json({ role: "user", username: user.username, id: user.id });
  res.cookies.set("user-id", user.id, { httpOnly: true, path: "/", maxAge: 86400 });
  return res;
}

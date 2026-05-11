import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const admin = await prisma.admin.findUnique({
    where: { username, password: hash },
  });
  if (admin) {
    const res = NextResponse.json({ role: "admin", username: admin.username, id: admin.id });
    res.cookies.set("admin-auth", "true", { httpOnly: true, path: "/", maxAge: 86400 });
    return res;
  }

  const user = await prisma.user.findUnique({
    where: { username, password: hash },
  });
  if (user) {
    const res = NextResponse.json({ role: "user", username: user.username, id: user.id });
    res.cookies.set("user-id", user.id, { httpOnly: true, path: "/", maxAge: 86400 });
    return res;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

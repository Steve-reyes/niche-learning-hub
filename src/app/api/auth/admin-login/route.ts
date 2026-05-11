import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const admin = await prisma.admin.findUnique({
    where: { username, password: hash },
  });
  if (!admin) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ role: "admin", username: admin.username, id: admin.id });
  res.cookies.set("admin-auth", "true", { httpOnly: true, path: "/", maxAge: 86400 });
  return res;
}

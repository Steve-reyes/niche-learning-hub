import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const data: any = {};
  if (body.username) data.username = body.username;
  if (body.email) data.email = body.email;
  if (body.password) data.password = crypto.createHash("sha256").update(body.password).digest("hex");
  if (body.fullName !== undefined) data.fullName = body.fullName;
  if (body.mobile !== undefined) data.mobile = body.mobile;
  if (body.location !== undefined) data.location = body.location;
  if (body.disabled !== undefined) data.disabled = body.disabled;

  try {
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ id: user.id, username: user.username, email: user.email, fullName: user.fullName, mobile: user.mobile, location: user.location });
  } catch {
    return NextResponse.json({ error: "Username or email already taken" }, { status: 409 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
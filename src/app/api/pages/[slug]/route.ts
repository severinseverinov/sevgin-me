import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const body = await req.json();
  const page = await prisma.page.update({ where: { slug }, data: body });
  return NextResponse.json(page);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { slug } = await params;
  await prisma.page.delete({ where: { slug } });
  return NextResponse.json({ success: true });
}

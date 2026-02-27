import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, title, content, isPublished } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
  }

  const page = await prisma.page.create({
    data: { slug, title, content, isPublished: isPublished ?? true },
  });
  return NextResponse.json(page, { status: 201 });
}

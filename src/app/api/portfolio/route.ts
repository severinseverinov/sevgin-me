import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, description, content, imageUrl, link, tags, isPublished, order } = body;

  if (!title || !slug || !description) {
    return NextResponse.json({ error: "title, slug and description are required" }, { status: 400 });
  }

  const item = await prisma.portfolioItem.create({
    data: { title, slug, description, content, imageUrl, link, tags: tags ?? "", isPublished: isPublished ?? false, order: order ?? 0 },
  });
  return NextResponse.json(item, { status: 201 });
}

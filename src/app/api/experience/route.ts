import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, title, description, order } = body;

  if (!year || !title || !description) {
    return NextResponse.json({ error: "year, title and description are required" }, { status: 400 });
  }

  const item = await prisma.experience.create({
    data: { year, title, description, order: order ?? 0 },
  });
  return NextResponse.json(item, { status: 201 });
}

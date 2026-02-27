import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, category, order } = body;

  if (!name || !category) {
    return NextResponse.json({ error: "name and category are required" }, { status: 400 });
  }

  const skill = await prisma.skill.create({
    data: { name, category, order: order ?? 0 },
  });
  return NextResponse.json(skill, { status: 201 });
}

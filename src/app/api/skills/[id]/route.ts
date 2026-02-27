import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const skill = await prisma.skill.update({ where: { id }, data: body });
  return NextResponse.json(skill);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

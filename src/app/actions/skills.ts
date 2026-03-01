'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getSkill(id: string) {
  if (!id) return null;
  return prisma.skill.findUnique({
    where: { id },
  });
}

export async function createSkill(data: any) {
  const result = await prisma.skill.create({ data });
  revalidatePath('/admin/skills');
  revalidatePath('/');
  return result;
}

export async function updateSkill(id: string, data: any) {
  const result = await prisma.skill.update({
    where: { id },
    data,
  });
  revalidatePath('/admin/skills');
  revalidatePath('/');
  return result;
}

export async function deleteSkill(id: string) {
  const result = await prisma.skill.delete({
    where: { id },
  });
  revalidatePath('/admin/skills');
  revalidatePath('/');
  return result;
}

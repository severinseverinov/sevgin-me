'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getExperience(id: string) {
  if (!id) return null;
  return prisma.experience.findUnique({
    where: { id },
  });
}

export async function createExperience(data: any) {
  const result = await prisma.experience.create({ data });
  revalidatePath('/admin/experience');
  revalidatePath('/');
  return result;
}

export async function updateExperience(id: string, data: any) {
  const result = await prisma.experience.update({
    where: { id },
    data,
  });
  revalidatePath('/admin/experience');
  revalidatePath('/');
  return result;
}

export async function deleteExperience(id: string) {
  const result = await prisma.experience.delete({
    where: { id },
  });
  revalidatePath('/admin/experience');
  revalidatePath('/');
  return result;
}

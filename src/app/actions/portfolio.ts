'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPortfolioItems() {
  return prisma.portfolioItem.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getPortfolioItem(id: string) {
  if (!id) return null;
  return prisma.portfolioItem.findUnique({
    where: { id },
  });
}

export async function createPortfolioItem(data: any) {
  const result = await prisma.portfolioItem.create({ data });
  revalidatePath('/admin/portfolio');
  revalidatePath('/');
  return result;
}

export async function updatePortfolioItem(id: string, data: any) {
  const result = await prisma.portfolioItem.update({
    where: { id },
    data,
  });
  revalidatePath('/admin/portfolio');
  revalidatePath('/');
  return result;
}

export async function deletePortfolioItem(id: string) {
  const result = await prisma.portfolioItem.delete({
    where: { id },
  });
  revalidatePath('/admin/portfolio');
  revalidatePath('/');
  return result;
}

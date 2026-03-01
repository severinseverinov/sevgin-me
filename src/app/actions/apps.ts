'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getApps() {
  return prisma.app.findMany({ orderBy: { order: 'asc' } });
}

export async function getApp(id: string) {
  return prisma.app.findUnique({ where: { id } });
}

export async function createApp(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  type: string;
  url?: string;
  color?: string;
  isPublished: boolean;
  order: number;
}) {
  const result = await prisma.app.create({ data });
  revalidatePath('/admin/apps');
  return result;
}

export async function updateApp(id: string, data: Partial<{
  name: string;
  slug: string;
  description: string;
  icon: string;
  type: string;
  url: string;
  color: string;
  isPublished: boolean;
  order: number;
}>) {
  const result = await prisma.app.update({ where: { id }, data });
  revalidatePath('/admin/apps');
  return result;
}

export async function deleteApp(id: string) {
  const result = await prisma.app.delete({ where: { id } });
  revalidatePath('/admin/apps');
  return result;
}

// Get apps a specific user can access
export async function getUserApps(userId: string) {
  const entries = await prisma.userApp.findMany({
    where: { userId },
    include: { app: true },
  });
  return entries.map(e => e.app);
}

// Get app IDs assigned to a user
export async function getUserAppIds(userId: string): Promise<string[]> {
  const entries = await prisma.userApp.findMany({
    where: { userId },
    select: { appId: true },
  });
  return entries.map(e => e.appId);
}

// Replace all app assignments for a user
export async function setUserApps(userId: string, appIds: string[]) {
  // Delete all existing, then insert new ones
  await prisma.userApp.deleteMany({ where: { userId } });
  if (appIds.length > 0) {
    await prisma.userApp.createMany({
      data: appIds.map(appId => ({ userId, appId })),
    });
  }
  revalidatePath('/admin/users');
  revalidatePath('/portal/dashboard');
}

// Get all users with their app assignments (for admin)
export async function getUsersWithApps() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      permissions: true,
      updatedAt: true,
      apps: { select: { appId: true } },
    },
  });
}

// Get a portal user's accessible apps (published only)
export async function getPortalUserApps(userId: string) {
  const entries = await prisma.userApp.findMany({
    where: { userId, app: { isPublished: true } },
    include: { app: true },
    orderBy: { app: { order: 'asc' } },
  });
  return entries.map(e => e.app);
}

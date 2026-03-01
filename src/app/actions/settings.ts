'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  });
  
  // Create default if not exists
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: 'singleton' },
    });
  }
  
  return settings;
}

export async function updateSiteSettings(data: any) {
  const result = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data },
  });
  revalidatePath('/admin/settings');
  revalidatePath('/');
  return result;
}

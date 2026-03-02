'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';

export async function getMyProfile() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string })?.id;
  if (!id) throw new Error('Not authenticated');
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function updateMyProfile(data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string })?.id;
  if (!id) throw new Error('Not authenticated');

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  // If changing password, verify the current one first
  if (data.newPassword && data.newPassword.trim() !== '') {
    if (!data.currentPassword) throw new Error('Current password is required to set a new password');
    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) throw new Error('Current password is incorrect');
  }

  // If changing email, ensure it's not taken by another user
  if (data.email !== undefined && data.email.trim().toLowerCase() !== user.email) {
    const newEmail = data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (existing && existing.id !== id) {
      throw new Error('This email is already used by another account.');
    }
  }

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
  if (data.newPassword && data.newPassword.trim() !== '') {
    updateData.password = await bcrypt.hash(data.newPassword, 12);
  }

  const result = await prisma.user.update({ where: { id }, data: updateData });
  revalidatePath('/admin/profile');
  return result;
}

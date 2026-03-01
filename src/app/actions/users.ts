'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { DEFAULT_PERMISSIONS, type Role } from '@/lib/permissions';

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, permissions: true, createdAt: true, updatedAt: true },
  });
}

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, permissions: true },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const result = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      permissions: JSON.stringify(
        data.permissions.length > 0
          ? data.permissions
          : DEFAULT_PERMISSIONS[data.role as Role] ?? [],
      ),
    },
  });
  revalidatePath('/admin/users');
  return result;
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    permissions?: string[];
  },
) {
  const updateData: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    role: data.role,
    permissions: JSON.stringify(data.permissions ?? []),
  };

  if (data.password && data.password.trim() !== '') {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const result = await prisma.user.update({ where: { id }, data: updateData });
  revalidatePath('/admin/users');
  return result;
}

export async function deleteUser(id: string) {
  const result = await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/users');
  return result;
}

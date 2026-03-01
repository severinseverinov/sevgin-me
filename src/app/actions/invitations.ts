"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const INVITATION_EXPIRY_DAYS = 7;
const BASE_URL = process.env.NEXTAUTH_URL ?? "https://sevginserbest.com";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function parseAppIds(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/** Admin only: create invitation and send email. */
export async function createInvitation(email: string, appIds: string[]) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) throw new Error("Email is required");

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) throw new Error("A user with this email already exists.");

  const pending = await prisma.invitation.findFirst({
    where: { email: normalizedEmail, usedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (pending && pending.expiresAt > new Date()) {
    throw new Error("An invitation for this email is already pending.");
  }

  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

  const invitedById = (session!.user as { id?: string }).id;
  if (!invitedById) throw new Error("Invalid session");

  await prisma.invitation.create({
    data: {
      email: normalizedEmail,
      token,
      appIds: JSON.stringify(appIds),
      expiresAt,
      invitedById,
    },
  });

  const registerUrl = `${BASE_URL}/portal/register?token=${token}`;
  const appCount = appIds.length;
  const { ok, error } = await sendEmail({
    to: normalizedEmail,
    subject: "You're invited to Sevgin Serbest",
    html: `
      <p>You've been invited to access applications at sevginserbest.com.</p>
      <p>You will have access to ${appCount} application${appCount !== 1 ? "s" : ""} after you complete registration.</p>
      <p><a href="${registerUrl}" style="display:inline-block; margin-top:12px; padding:10px 20px; background:#0D9488; color:white; text-decoration:none; border-radius:8px;">Accept invitation &amp; set password</a></p>
      <p style="margin-top:16px; color:#666; font-size:14px;">This link expires in ${INVITATION_EXPIRY_DAYS} days. If you didn't expect this email, you can ignore it.</p>
    `,
  });

  if (!ok) {
    throw new Error(error ?? "Failed to send invitation email");
  }

  revalidatePath("/admin/users");
  return { success: true };
}

/** Public: get invitation by token for the register page. */
export async function getInvitationByToken(token: string) {
  if (!token?.trim()) return null;
  const inv = await prisma.invitation.findUnique({
    where: { token: token.trim() },
  });
  if (!inv || inv.usedAt || inv.expiresAt < new Date()) return null;
  return {
    email: inv.email,
    appIds: parseAppIds(inv.appIds),
  };
}

/** Public: accept invitation – create user and assign apps. */
export async function acceptInvitation(
  token: string,
  data: { name: string; password: string }
) {
  const inv = await prisma.invitation.findUnique({
    where: { token: token.trim() },
  });
  if (!inv) throw new Error("Invalid or expired invitation.");
  if (inv.usedAt) throw new Error("This invitation has already been used.");
  if (inv.expiresAt < new Date()) throw new Error("This invitation has expired.");

  const existingUser = await prisma.user.findUnique({
    where: { email: inv.email },
  });
  if (existingUser) throw new Error("An account with this email already exists.");

  const name = data.name?.trim() || null;
  const password = (data.password ?? "").trim();
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  const hashedPassword = await bcrypt.hash(password, 12);
  const appIds = parseAppIds(inv.appIds);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: inv.email,
        name,
        password: hashedPassword,
        role: "VIEWER",
        permissions: "[]",
      },
    });

    if (appIds.length > 0) {
      await tx.userApp.createMany({
        data: appIds.map((appId) => ({ userId: user.id, appId })),
      });
    }

    await tx.invitation.update({
      where: { id: inv.id },
      data: { usedAt: new Date() },
    });
  });

  return { success: true };
}

/** Admin only: list pending invitations. */
export async function getPendingInvitations() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== "SUPER_ADMIN") return [];

  return prisma.invitation.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      expiresAt: true,
      createdAt: true,
    },
  });
}

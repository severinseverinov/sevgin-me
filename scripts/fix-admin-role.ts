/**
 * Production'da admin paneli "Access Denied" veriyorsa,
 * veritabanındaki kullanıcı rolü SUPER_ADMIN değildir.
 * Bu script'i sunucuda bir kez çalıştır (DATABASE_URL .env'de olmalı):
 *
 *   npx tsx scripts/fix-admin-role.ts
 *
 * Veya e-posta belirt:
 *   ADMIN_EMAIL=senin@email.com npx tsx scripts/fix-admin-role.ts
 */

import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const email = process.env.ADMIN_EMAIL ?? "admin@sevginserbest.com";

async function main() {
  const prisma = new PrismaClient();
  const result = await prisma.user.updateMany({
    where: { email },
    data: { role: "SUPER_ADMIN" },
  });
  if (result.count === 0) {
    console.warn(`No user found with email: ${email}`);
    process.exit(1);
  }
  console.log(`Updated ${result.count} user(s) to SUPER_ADMIN: ${email}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

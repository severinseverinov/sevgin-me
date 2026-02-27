import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@sevginserbest.com";
  const password = "password123"; // CHANGE THIS IN PRODUCTION
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name: "Sevgin Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`Created admin user: ${user.email} with password: ${password}`);
  } else {
    console.log(`Admin user already exists: ${existingUser.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

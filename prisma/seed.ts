/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Generate guest user
  await prisma.user.upsert({
    create: {
      id: "guest",
      email: "guest@guest.com",
      emailVerified: new Date(),
      name: "Guest",
    },
    where: { id: "guest" },
    update: {},
  });
  console.log("Generated guest user");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

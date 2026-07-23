import { prisma } from "../client.js";
import bcrypt from 'bcrypt';

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME / ADMIN_PASSWORD belum di-set di .env');
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: {}, 
    create: {
      username,
      password: hashed,
      role: 'ADMIN',
    },
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
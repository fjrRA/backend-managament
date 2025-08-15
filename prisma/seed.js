require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminHashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const customerHashed = await bcrypt.hash(process.env.CUSTOMER_PASSWORD, 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin Satu',
        email: 'admin@example.com',
        password: adminHashed,
        role: 'admin'
      },
      {
        name: 'Customer Satu',
        email: 'customer@example.com',
        password: customerHashed,
        role: 'customer'
      },
    ],
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: [
      { name: 'Produk A', price: 10000, stock: 10 },
      { name: 'Produk B', price: 20000, stock: 5 },
      { name: 'Produk C', price: 15000, stock: 8 }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed data berhasil dibuat');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

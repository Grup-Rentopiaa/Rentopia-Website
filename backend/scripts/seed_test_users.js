const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seed() {
  const hash = await bcrypt.hash('Test1234!', 10);
  
  
  const buyer = await prisma.users.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: { username: 'buyer_test', email: 'buyer@test.com' }
  });
  await prisma.auth.upsert({
    where: { user_id: buyer.id },
    update: { password: hash, otp: null, otp_expired_at: null },
    create: { user_id: buyer.id, password: hash }
  });
  
   
  const seller = await prisma.users.upsert({
    where: { email: 'seller@test.com' },
    update: {},
    create: { username: 'seller_test', email: 'seller@test.com' }
  });
  await prisma.auth.upsert({
    where: { user_id: seller.id },
    update: { password: hash, otp: null, otp_expired_at: null },
    create: { user_id: seller.id, password: hash }
  });
  
  console.log('SEED OK | buyer_id=' + buyer.id + ' seller_id=' + seller.id);
  await prisma.$disconnect();
}
seed().catch(function(e){ console.error(e.message); process.exit(1); });

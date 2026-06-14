const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProduct() {
  
  const seller = await prisma.users.findUnique({ where: { email: 'seller@test.com' } });
  if (!seller) { console.error('Seller not found!'); process.exit(1); }

  
  let cat = await prisma.category.findFirst({ where: { name: 'Elektronik' } });
  if (!cat) cat = await prisma.category.create({ data: { name: 'Elektronik' } });

  const item = await prisma.item.upsert({
    where: { id: 999 },
    update: {},
    create: {
      id: 999,
      title: 'Kamera DSLR Test',
      description: 'Test product untuk demo rental flow',
      price_per_day: 50000,
      location: 'Jakarta',
      status: 'available',
      category_id: cat.id,
      owner_id: seller.id,
    }
  });

  console.log('PRODUCT OK | item_id=' + item.id + ' owner_id=' + item.owner_id);
  await prisma.$disconnect();
}
seedProduct().catch(function(e){ console.error(e.message); process.exit(1); });

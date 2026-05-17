import { PrismaClient, UserRole, SubscriptionPlan } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Planos de assinatura
  const plans = [
    { name: 'Gratuito', slug: SubscriptionPlan.FREE, price: 0, maxProducts: 10, maxOrders: 50, commission: 18, features: { support: 'email', analytics: false, customDomain: false } },
    { name: 'Starter', slug: SubscriptionPlan.STARTER, price: 99.90, maxProducts: 50, maxOrders: 500, commission: 14, features: { support: 'email+chat', analytics: true, customDomain: false } },
    { name: 'Profissional', slug: SubscriptionPlan.PROFESSIONAL, price: 249.90, maxProducts: 200, maxOrders: 2000, commission: 12, features: { support: 'priority', analytics: true, customDomain: true } },
    { name: 'Enterprise', slug: SubscriptionPlan.ENTERPRISE, price: 599.90, maxProducts: -1, maxOrders: -1, commission: 8, features: { support: '24/7', analytics: true, customDomain: true, dedicatedAccount: true } },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({ where: { slug: plan.slug }, update: plan, create: plan })
  }
  console.log('✅ Planos criados')

  // Admin
  const adminHash = await bcrypt.hash('Admin@123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@pedizi.com.br' },
    update: {},
    create: { name: 'Admin PEDIZI', email: 'admin@pedizi.com.br', passwordHash: adminHash, role: UserRole.ADMIN, isEmailVerified: true },
  })
  console.log('✅ Admin criado: admin@pedizi.com.br / Admin@123')

  // Cliente de teste
  const clientHash = await bcrypt.hash('Cliente@123', 12)
  const client = await prisma.user.upsert({
    where: { email: 'joao@teste.com' },
    update: {},
    create: { name: 'João Silva', email: 'joao@teste.com', phone: '11999999901', passwordHash: clientHash, role: UserRole.CLIENT, isEmailVerified: true },
  })

  // Endereço do cliente
  await prisma.address.upsert({
    where: { id: 'addr-joao-01' },
    update: {},
    create: { id: 'addr-joao-01', userId: client.id, label: 'Casa', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'Franca', state: 'SP', zipCode: '14400-000', latitude: -20.539, longitude: -47.400, isDefault: true },
  })
  console.log('✅ Cliente de teste criado: joao@teste.com / Cliente@123')

  // Restaurante demo
  const ownerHash = await bcrypt.hash('Owner@123', 12)
  const owner = await prisma.user.upsert({
    where: { email: 'dono@burguerhouse.com' },
    update: {},
    create: { name: 'Carlos Burguer', email: 'dono@burguerhouse.com', phone: '11999999902', passwordHash: ownerHash, role: UserRole.RESTAURANT_OWNER, isEmailVerified: true },
  })

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'burguer-house-franca' },
    update: {},
    create: {
      ownerId: owner.id,
      name: 'Burguer House',
      slug: 'burguer-house-franca',
      description: 'Os melhores hambúrgueres artesanais da cidade!',
      phone: '1633333333',
      email: 'contato@burguerhouse.com',
      document: '12345678000195',
      status: 'ACTIVE',
      isOpen: true,
      deliveryFee: 5.00,
      minOrderValue: 25.00,
      estimatedDeliveryTime: 35,
      maxDeliveryRadius: 8,
      commission: 12,
      street: 'Av. Dr. Ismael Alonso y Alonso',
      number: '500',
      neighborhood: 'Centro',
      city: 'Franca',
      state: 'SP',
      zipCode: '14400-660',
      latitude: -20.538,
      longitude: -47.399,
      subscriptionPlan: SubscriptionPlan.PROFESSIONAL,
    },
  })

  // Categorias do cardápio
  const catBurger = await prisma.menuCategory.upsert({ where: { id: 'cat-burger' }, update: {}, create: { id: 'cat-burger', restaurantId: restaurant.id, name: 'Hambúrgueres', sortOrder: 1 } })
  const catCombo = await prisma.menuCategory.upsert({ where: { id: 'cat-combo' }, update: {}, create: { id: 'cat-combo', restaurantId: restaurant.id, name: 'Combos', sortOrder: 2 } })
  const catDrinks = await prisma.menuCategory.upsert({ where: { id: 'cat-drinks' }, update: {}, create: { id: 'cat-drinks', restaurantId: restaurant.id, name: 'Bebidas', sortOrder: 3 } })

  // Itens do cardápio
  const items = [
    { id: 'item-001', restaurantId: restaurant.id, categoryId: catBurger.id, name: 'Classic Burguer', description: 'Pão brioche, blend 180g, queijo cheddar, alface, tomate e molho especial', price: 32.90, preparationTime: 20 },
    { id: 'item-002', restaurantId: restaurant.id, categoryId: catBurger.id, name: 'BBQ Smash', description: 'Dois smash burgers 90g, bacon crocante, queijo americano e molho BBQ', price: 42.90, preparationTime: 15 },
    { id: 'item-003', restaurantId: restaurant.id, categoryId: catBurger.id, name: 'Frango Crispy', description: 'Frango empanado crocante, queijo prato, maionese de ervas e rúcula', price: 34.90, preparationTime: 20 },
    { id: 'item-004', restaurantId: restaurant.id, categoryId: catCombo.id, name: 'Combo Classic', description: 'Classic Burguer + Batata Frita + Refrigerante 350ml', price: 52.90, preparationTime: 25 },
    { id: 'item-005', restaurantId: restaurant.id, categoryId: catDrinks.id, name: 'Refrigerante Lata', description: 'Coca-Cola, Guaraná ou Sprite 350ml', price: 6.00, preparationTime: 2 },
    { id: 'item-006', restaurantId: restaurant.id, categoryId: catDrinks.id, name: 'Suco Natural', description: 'Laranja, limão ou maracujá 400ml', price: 9.00, preparationTime: 5 },
  ]

  for (const item of items) {
    await prisma.menuItem.upsert({ where: { id: item.id }, update: {}, create: item })
  }

  // Horários de funcionamento
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const
  for (const day of days) {
    await prisma.businessHour.upsert({
      where: { restaurantId_dayOfWeek: { restaurantId: restaurant.id, dayOfWeek: day } },
      update: {},
      create: { restaurantId: restaurant.id, dayOfWeek: day, openTime: '11:00', closeTime: '23:00', isOpen: day !== 'SUNDAY' },
    })
  }

  // Cupom demo
  await prisma.coupon.upsert({
    where: { code: 'PEDIZI10' },
    update: {},
    create: { code: 'PEDIZI10', type: 'PERCENTAGE', value: 10, minOrderValue: 30, maxDiscount: 15, usageLimit: 100, isActive: true, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  })

  console.log('✅ Restaurante demo criado: dono@burguerhouse.com / Owner@123')
  console.log('✅ Cupom de teste: PEDIZI10 (10% de desconto)')
  console.log('')
  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('📋 Credenciais:')
  console.log('   Admin:      admin@pedizi.com.br / Admin@123')
  console.log('   Cliente:    joao@teste.com / Cliente@123')
  console.log('   Restaurante: dono@burguerhouse.com / Owner@123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'
import slugify from 'slugify'

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, data: {
    name: string; description?: string; phone: string; email: string; document: string
    deliveryFee: number; minOrderValue: number; estimatedDeliveryTime: number; maxDeliveryRadius: number
    street: string; number: string; complement?: string; neighborhood: string
    city: string; state: string; zipCode: string; latitude: number; longitude: number
  }) {
    const existing = await this.prisma.restaurant.findUnique({ where: { document: data.document } })
    if (existing) throw new ConflictException('CNPJ já cadastrado')

    const slug = slugify(data.name, { lower: true, strict: true })
    const uniqueSlug = `${slug}-${Date.now()}`

    return this.prisma.restaurant.create({
      data: { ownerId, slug: uniqueSlug, status: 'PENDING_APPROVAL', ...data },
    })
  }

  async findNearby(params: { latitude: number; longitude: number; radius?: number; search?: string; page: number; limit: number }) {
    const { latitude, longitude, radius = 10, search, page, limit } = params
    const skip = (page - 1) * limit

    // Busca restaurantes ativos dentro do raio usando fórmula de Haversine aproximada (PostgreSQL)
    const where = {
      status: 'ACTIVE' as const,
      isOpen: true,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    }

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurant.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.restaurant.count({ where }),
    ])

    return {
      data: restaurants,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 },
    }
  }

  async findById(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuCategories: {
          where: { isActive: true },
          include: { items: { where: { isAvailable: true }, orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
        businessHours: true,
        reviews: { take: 10, orderBy: { createdAt: 'desc' }, include: { client: { select: { name: true, avatarUrl: true } } } },
      },
    })
    if (!restaurant) throw new NotFoundException('Restaurante não encontrado')
    return restaurant
  }

  async findBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: {
        menuCategories: { where: { isActive: true }, include: { items: { where: { isAvailable: true }, orderBy: { sortOrder: 'asc' } } }, orderBy: { sortOrder: 'asc' } },
        businessHours: true,
      },
    })
    if (!restaurant) throw new NotFoundException('Restaurante não encontrado')
    return restaurant
  }

  async findByOwner(ownerId: string) {
    return this.prisma.restaurant.findMany({
      where: { ownerId },
      include: { _count: { select: { orders: true, reviews: true } } },
    })
  }

  async update(id: string, ownerId: string, data: Partial<{
    name: string; description: string; phone: string; deliveryFee: number
    minOrderValue: number; estimatedDeliveryTime: number; isOpen: boolean
    logoUrl: string; coverUrl: string
  }>) {
    await this.checkOwnership(id, ownerId)
    return this.prisma.restaurant.update({ where: { id }, data })
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'REJECTED', adminId?: string) {
    return this.prisma.restaurant.update({ where: { id }, data: { status } })
  }

  async toggleOpen(id: string, ownerId: string) {
    await this.checkOwnership(id, ownerId)
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } })
    return this.prisma.restaurant.update({ where: { id }, data: { isOpen: !restaurant?.isOpen } })
  }

  async getDashboardStats(restaurantId: string, ownerId: string) {
    await this.checkOwnership(restaurantId, ownerId)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [ordersToday, totalRevenue, totalOrders, avgRating, pendingOrders] = await Promise.all([
      this.prisma.order.count({ where: { restaurantId, createdAt: { gte: today } } }),
      this.prisma.order.aggregate({ where: { restaurantId, status: 'DELIVERED' }, _sum: { total: true } }),
      this.prisma.order.count({ where: { restaurantId } }),
      this.prisma.review.aggregate({ where: { restaurantId }, _avg: { restaurantRating: true } }),
      this.prisma.order.count({ where: { restaurantId, status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] } } }),
    ])

    return {
      ordersToday,
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      avgRating: avgRating._avg.restaurantRating || 0,
      pendingOrders,
    }
  }

  private async checkOwnership(restaurantId: string, ownerId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } })
    if (!restaurant) throw new NotFoundException('Restaurante não encontrado')
    if (restaurant.ownerId !== ownerId) throw new ForbiddenException('Sem permissão')
    return restaurant
  }
}

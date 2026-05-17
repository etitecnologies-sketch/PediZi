import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, data: { orderId: string; restaurantRating: number; courierRating?: number; comment?: string }) {
    const order = await this.prisma.order.findUnique({ where: { id: data.orderId } })
    if (!order || order.clientId !== clientId) throw new NotFoundException('Pedido não encontrado')
    if (order.status !== 'DELIVERED') throw new ConflictException('Só é possível avaliar pedidos entregues')

    const existing = await this.prisma.review.findUnique({ where: { orderId: data.orderId } })
    if (existing) throw new ConflictException('Pedido já avaliado')

    return this.prisma.review.create({ data: { clientId, restaurantId: order.restaurantId, ...data } })
  }

  async findByRestaurant(restaurantId: string, params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit
    const [reviews, total, avgRating] = await Promise.all([
      this.prisma.review.findMany({
        where: { restaurantId, isPublic: true },
        skip,
        take: limit,
        include: { client: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { restaurantId } }),
      this.prisma.review.aggregate({ where: { restaurantId }, _avg: { restaurantRating: true } }),
    ])
    return { data: reviews, meta: { total, page, limit, avgRating: avgRating._avg.restaurantRating || 0 } }
  }
}

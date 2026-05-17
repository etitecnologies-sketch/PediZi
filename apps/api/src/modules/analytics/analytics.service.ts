import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminDashboard() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    const [
      totalRevenue,
      ordersToday,
      activeRestaurants,
      totalUsers,
      activeDeliveries,
      avgTicket,
      revenueLastMonth,
      ordersLastMonth,
    ] = await Promise.all([
      this.prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: thisMonth } }, _sum: { amount: true } }),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.restaurant.count({ where: { status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.delivery.count({ where: { status: { in: ['COURIER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] } } }),
      this.prisma.order.aggregate({ where: { status: 'DELIVERED', createdAt: { gte: thisMonth } }, _avg: { total: true } }),
      this.prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: lastMonth, lte: endLastMonth } }, _sum: { amount: true } }),
      this.prisma.order.count({ where: { createdAt: { gte: lastMonth, lte: endLastMonth } } }),
    ])

    return {
      kpis: {
        totalRevenue: totalRevenue._sum.amount || 0,
        ordersToday,
        activeRestaurants,
        totalUsers,
        activeDeliveries,
        avgTicket: avgTicket._avg.total || 0,
      },
      comparisons: {
        revenueLastMonth: revenueLastMonth._sum.amount || 0,
        ordersLastMonth,
      },
    }
  }

  async getMonthlyRevenue() {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      return { year: d.getFullYear(), month: d.getMonth() + 1 }
    }).reverse()

    const data = await Promise.all(
      months.map(async ({ year, month }) => {
        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 0)
        const result = await this.prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: start, lte: end } }, _sum: { amount: true } })
        const orders = await this.prisma.order.count({ where: { createdAt: { gte: start, lte: end } } })
        return { month: `${year}-${String(month).padStart(2, '0')}`, revenue: result._sum.amount || 0, orders }
      }),
    )

    return data
  }

  async getTopRestaurants(limit = 10) {
    return this.prisma.restaurant.findMany({
      where: { status: 'ACTIVE' },
      take: limit,
      include: { _count: { select: { orders: true } }, reviews: { select: { restaurantRating: true } } },
      orderBy: { orders: { _count: 'desc' } },
    })
  }

  async getRestaurantAnalytics(restaurantId: string, period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date()
    const start = new Date()
    if (period === 'week') start.setDate(now.getDate() - 7)
    else if (period === 'month') start.setMonth(now.getMonth() - 1)
    else start.setFullYear(now.getFullYear() - 1)

    const [revenue, orderCount, avgTicket, topItems] = await Promise.all([
      this.prisma.payment.aggregate({ where: { order: { restaurantId }, status: 'PAID', paidAt: { gte: start } }, _sum: { amount: true } }),
      this.prisma.order.count({ where: { restaurantId, createdAt: { gte: start } } }),
      this.prisma.order.aggregate({ where: { restaurantId, status: 'DELIVERED', createdAt: { gte: start } }, _avg: { total: true } }),
      this.prisma.orderItem.groupBy({ by: ['name'], where: { order: { restaurantId, createdAt: { gte: start } } }, _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 5 }),
    ])

    return { revenue: revenue._sum.amount || 0, orderCount, avgTicket: avgTicket._avg.total || 0, topItems }
  }
}

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getRestaurantsPendingApproval() {
    return this.prisma.restaurant.findMany({ where: { status: 'PENDING_APPROVAL' }, include: { owner: { select: { name: true, email: true, phone: true } } }, orderBy: { createdAt: 'desc' } })
  }

  async approveRestaurant(id: string) {
    return this.prisma.restaurant.update({ where: { id }, data: { status: 'ACTIVE' } })
  }

  async rejectRestaurant(id: string, reason?: string) {
    return this.prisma.restaurant.update({ where: { id }, data: { status: 'REJECTED' } })
  }

  async suspendRestaurant(id: string) {
    return this.prisma.restaurant.update({ where: { id }, data: { status: 'SUSPENDED', isOpen: false } })
  }

  async getCouriersPendingApproval() {
    return this.prisma.courier.findMany({ where: { status: 'PENDING_APPROVAL' }, include: { user: { select: { name: true, email: true, phone: true } } } })
  }

  async approveCourier(id: string) {
    return this.prisma.courier.update({ where: { id }, data: { status: 'ACTIVE' } })
  }

  async getUsers(params: { page: number; limit: number; role?: string; search?: string }) {
    const { page, limit, role, search } = params
    const skip = (page - 1) * limit
    const where = {
      ...(role && { role: role as any }),
      ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }),
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take: limit, select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ])
    return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async toggleUserStatus(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return this.prisma.user.update({ where: { id }, data: { isActive: !user?.isActive } })
  }

  async getPlatformFinancials(period: 'month' | 'year' = 'month') {
    const start = new Date()
    if (period === 'month') start.setMonth(start.getMonth() - 1)
    else start.setFullYear(start.getFullYear() - 1)

    const [totalRevenue, platformFees, restaurantPayouts, refunds] = await Promise.all([
      this.prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: start } }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: start } }, _sum: { platformFee: true } }),
      this.prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: start } }, _sum: { restaurantAmount: true } }),
      this.prisma.payment.count({ where: { status: 'REFUNDED', refundedAt: { gte: start } } }),
    ])

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      platformFees: platformFees._sum.platformFee || 0,
      restaurantPayouts: restaurantPayouts._sum.restaurantAmount || 0,
      refunds,
    }
  }
}

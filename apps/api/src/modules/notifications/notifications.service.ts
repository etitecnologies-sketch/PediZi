import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'
import { RealtimeService } from '../../infra/realtime/realtime.service'
type NotificationType = 'ORDER_PLACED' | 'ORDER_CONFIRMED' | 'ORDER_PREPARING' | 'ORDER_READY' | 'ORDER_PICKED_UP' | 'ORDER_DELIVERING' | 'ORDER_DELIVERED' | 'ORDER_CANCELLED' | 'PAYMENT_APPROVED' | 'PAYMENT_FAILED' | 'COURIER_ASSIGNED' | 'SYSTEM'

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  async create(userId: string, data: { type: NotificationType; title: string; message: string; data?: Record<string, unknown> }) {
    const notification = await this.prisma.notification.create({ data: { userId, ...data } })
    this.realtime.notifyUser(userId, 'notification:sent', notification)
    return notification
  }

  async findByUser(userId: string, params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({ where: { userId }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ])
    return { data: notifications, meta: { total, page, limit, unreadCount } }
  }

  async markAsRead(userId: string, notificationId?: string) {
    if (notificationId) {
      return this.prisma.notification.updateMany({ where: { id: notificationId, userId }, data: { isRead: true } })
    }
    return this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } })
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'
import { RealtimeService } from '../../infra/realtime/realtime.service'

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  async assignCourier(orderId: string, courierId: string) {
    const delivery = await this.prisma.delivery.upsert({
      where: { orderId },
      create: { orderId, courierId, status: 'COURIER_ASSIGNED', assignedAt: new Date() },
      update: { courierId, status: 'COURIER_ASSIGNED', assignedAt: new Date() },
    })

    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    if (order) {
      this.realtime.notifyUser(order.clientId, 'courier:assigned', { orderId, courierId })
      this.realtime.notifyOrderStatusChange(orderId, 'COURIER_ASSIGNED', delivery)
    }

    return delivery
  }

  async updateDeliveryStatus(orderId: string, status: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED') {
    const delivery = await this.prisma.delivery.update({
      where: { orderId },
      data: {
        status,
        ...(status === 'PICKED_UP' && { pickedUpAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'FAILED' && { failedAt: new Date() }),
      },
    })

    if (status === 'DELIVERED') {
      await this.prisma.order.update({ where: { id: orderId }, data: { status: 'DELIVERED' } })
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    if (order) this.realtime.notifyUser(order.clientId, 'delivery:status_changed', { orderId, status })

    return delivery
  }

  async updateCourierLocation(courierId: string, latitude: number, longitude: number) {
    const courier = await this.prisma.courier.update({
      where: { id: courierId },
      data: { currentLatitude: latitude, currentLongitude: longitude },
    })

    const activeDelivery = await this.prisma.delivery.findFirst({
      where: { courierId, status: 'IN_TRANSIT' },
    })

    if (activeDelivery) {
      this.realtime.emitToRoom(`order:${activeDelivery.orderId}`, 'courier:location_updated', { courierId, latitude, longitude })
    }

    return courier
  }

  async registerCourier(userId: string, data: { document: string; vehicleType: string; vehiclePlate?: string }) {
    return this.prisma.courier.create({
      data: { userId, status: 'PENDING_APPROVAL', ...data },
    })
  }

  async getCourierStats(courierId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalDeliveries, todayDeliveries, earnings] = await Promise.all([
      this.prisma.delivery.count({ where: { courierId, status: 'DELIVERED' } }),
      this.prisma.delivery.count({ where: { courierId, status: 'DELIVERED', deliveredAt: { gte: today } } }),
      this.prisma.delivery.aggregate({ where: { courierId, status: 'DELIVERED' }, _sum: { courierEarnings: true } }),
    ])

    return { totalDeliveries, todayDeliveries, totalEarnings: earnings._sum.courierEarnings || 0 }
  }
}

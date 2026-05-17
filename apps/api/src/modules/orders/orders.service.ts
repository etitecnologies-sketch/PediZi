import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'
import { RealtimeService } from '../../infra/realtime/realtime.service'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  async create(clientId: string, data: {
    restaurantId: string; addressId: string
    items: Array<{ menuItemId: string; quantity: number; notes?: string }>
    paymentMethod: string; couponCode?: string; notes?: string
  }) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: data.restaurantId } })
    if (!restaurant || !restaurant.isOpen) throw new BadRequestException('Restaurante fechado')

    // Busca itens do cardápio e calcula valores
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: data.items.map(i => i.menuItemId) }, restaurantId: data.restaurantId },
    })

    let subtotal = 0
    const orderItems = data.items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      if (!menuItem || !menuItem.isAvailable) throw new BadRequestException(`Item "${menuItem?.name}" indisponível`)
      const itemSubtotal = menuItem.price * item.quantity
      subtotal += itemSubtotal
      return { menuItemId: item.menuItemId, name: menuItem.name, price: menuItem.price, quantity: item.quantity, notes: item.notes, subtotal: itemSubtotal }
    })

    if (subtotal < restaurant.minOrderValue) {
      throw new BadRequestException(`Pedido mínimo: R$ ${restaurant.minOrderValue.toFixed(2)}`)
    }

    // Verifica cupom
    let discount = 0
    let couponId: string | undefined
    if (data.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: data.couponCode } })
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (coupon.type === 'PERCENTAGE') discount = subtotal * (coupon.value / 100)
        else if (coupon.type === 'FIXED') discount = coupon.value
        else if (coupon.type === 'FREE_DELIVERY') discount = restaurant.deliveryFee
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
        couponId = coupon.id
      }
    }

    const total = subtotal + restaurant.deliveryFee - discount
    const code = `PD${Date.now().toString(36).toUpperCase()}`

    const order = await this.prisma.order.create({
      data: {
        code,
        clientId,
        restaurantId: data.restaurantId,
        addressId: data.addressId,
        status: 'PENDING',
        subtotal,
        deliveryFee: restaurant.deliveryFee,
        discount,
        total,
        paymentMethod: data.paymentMethod as any,
        notes: data.notes,
        estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
        items: { create: orderItems },
        ...(couponId && { coupon: { create: { couponId, discount } } }),
      },
      include: { items: true, address: true },
    })

    // Notifica restaurante em tempo real
    this.realtime.notifyNewOrder(data.restaurantId, order)

    return order
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        restaurant: { select: { name: true, logoUrl: true, phone: true } },
        address: true,
        payment: true,
        delivery: { include: { courier: { include: { user: { select: { name: true, phone: true, avatarUrl: true } } } } } },
      },
    })
    if (!order) throw new NotFoundException('Pedido não encontrado')
    return order
  }

  async updateStatus(id: string, status: OrderStatus, actorId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundException('Pedido não encontrado')

    const updated = await this.prisma.order.update({ where: { id }, data: { status } })

    // Notifica em tempo real
    this.realtime.notifyOrderStatusChange(id, status, updated)
    this.realtime.notifyUser(order.clientId, 'order:status_changed', { orderId: id, status })

    return updated
  }

  async findByClient(clientId: string, params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { clientId },
        skip,
        take: limit,
        include: { restaurant: { select: { name: true, logoUrl: true } }, items: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { clientId } }),
    ])
    return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 } }
  }

  async findByRestaurant(restaurantId: string, params: { page: number; limit: number; status?: OrderStatus }) {
    const { page, limit, status } = params
    const skip = (page - 1) * limit
    const where = { restaurantId, ...(status && { status }) }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { items: true, client: { select: { name: true, phone: true } }, address: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ])
    return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 } }
  }
}

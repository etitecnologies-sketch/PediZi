import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'
type CouponType = 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY'

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { restaurantId?: string; code: string; type: CouponType; value: number; minOrderValue?: number; maxDiscount?: number; usageLimit?: number; expiresAt?: Date }) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: data.code } })
    if (existing) throw new BadRequestException('Código de cupom já existe')
    return this.prisma.coupon.create({ data })
  }

  async validate(code: string, restaurantId: string, subtotal: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } })
    if (!coupon) throw new NotFoundException('Cupom não encontrado')
    if (!coupon.isActive) throw new BadRequestException('Cupom inativo')
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new BadRequestException('Cupom expirado')
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new BadRequestException('Cupom esgotado')
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) throw new BadRequestException(`Pedido mínimo para este cupom: R$ ${coupon.minOrderValue.toFixed(2)}`)

    let discount = 0
    if (coupon.type === 'PERCENTAGE') discount = subtotal * (coupon.value / 100)
    else if (coupon.type === 'FIXED') discount = coupon.value
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)

    return { coupon, discount }
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.coupon.findMany({ where: { restaurantId }, orderBy: { createdAt: 'desc' } })
  }

  async deactivate(id: string) {
    return this.prisma.coupon.update({ where: { id }, data: { isActive: false } })
  }
}

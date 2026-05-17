import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'
import { SubscriptionPlan } from '@prisma/client'

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.plan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } })
  }

  async getByRestaurant(restaurantId: string) {
    return this.prisma.subscription.findUnique({ where: { restaurantId }, include: { plan: true } })
  }

  async subscribe(restaurantId: string, planSlug: SubscriptionPlan) {
    const plan = await this.prisma.plan.findUnique({ where: { slug: planSlug } })
    if (!plan) throw new NotFoundException('Plano não encontrado')

    const periodStart = new Date()
    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    return this.prisma.subscription.upsert({
      where: { restaurantId },
      create: { restaurantId, planId: plan.id, status: 'TRIALING', currentPeriodStart: periodStart, currentPeriodEnd: periodEnd, trialEndsAt: periodEnd },
      update: { planId: plan.id, status: 'ACTIVE', currentPeriodStart: periodStart, currentPeriodEnd: periodEnd },
      include: { plan: true },
    })
  }

  async cancel(restaurantId: string) {
    return this.prisma.subscription.update({
      where: { restaurantId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    })
  }
}

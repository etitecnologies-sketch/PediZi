import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
type SubscriptionPlan = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SubscriptionsService } from './subscriptions.service'

@ApiTags('subscriptions')
@Controller({ path: 'subscriptions', version: '1' })
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Listar planos disponíveis' })
  getPlans() {
    return this.subscriptionsService.getPlans()
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Assinatura do restaurante' })
  getByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.subscriptionsService.getByRestaurant(restaurantId)
  }

  @Post('restaurant/:restaurantId/subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Assinar plano' })
  subscribe(@Param('restaurantId') restaurantId: string, @Body() body: { plan: SubscriptionPlan }) {
    return this.subscriptionsService.subscribe(restaurantId, body.plan)
  }

  @Delete('restaurant/:restaurantId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Cancelar assinatura' })
  cancel(@Param('restaurantId') restaurantId: string) {
    return this.subscriptionsService.cancel(restaurantId)
  }
}

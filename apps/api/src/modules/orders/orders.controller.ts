import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OrdersService } from './orders.service'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

@ApiTags('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pedido' })
  create(@Request() req: { user: { sub: string } }, @Body() body: any) {
    return this.ordersService.create(req.user.sub, body)
  }

  @Get('my')
  @ApiOperation({ summary: 'Meus pedidos' })
  myOrders(
    @Request() req: { user: { sub: string } },
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.ordersService.findByClient(req.user.sub, { page: Number(page), limit: Number(limit) })
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Pedidos do restaurante' })
  restaurantOrders(
    @Param('restaurantId') restaurantId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findByRestaurant(restaurantId, { page: Number(page), limit: Number(limit), status: status as any })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do pedido' })
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido' })
  updateStatus(
    @Param('id') id: string,
    @Request() req: { user: { sub: string } },
    @Body() body: { status: OrderStatus },
  ) {
    return this.ordersService.updateStatus(id, body.status as any, req.user.sub)
  }
}

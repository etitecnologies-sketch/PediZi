import { Controller, Post, Patch, Get, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { DeliveryService } from './delivery.service'

@ApiTags('delivery')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller({ path: 'delivery', version: '1' })
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('register-courier')
  @ApiOperation({ summary: 'Registrar como entregador' })
  registerCourier(@Request() req: { user: { sub: string } }, @Body() body: { document: string; vehicleType: string; vehiclePlate?: string }) {
    return this.deliveryService.registerCourier(req.user.sub, body)
  }

  @Patch(':orderId/assign')
  @ApiOperation({ summary: 'Atribuir entregador ao pedido' })
  assignCourier(@Param('orderId') orderId: string, @Body() body: { courierId: string }) {
    return this.deliveryService.assignCourier(orderId, body.courierId)
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Atualizar status da entrega' })
  updateStatus(@Param('orderId') orderId: string, @Body() body: { status: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' }) {
    return this.deliveryService.updateDeliveryStatus(orderId, body.status)
  }

  @Patch('courier/location')
  @ApiOperation({ summary: 'Atualizar localização do entregador' })
  updateLocation(
    @Request() req: { user: { sub: string } },
    @Body() body: { courierId: string; latitude: number; longitude: number },
  ) {
    return this.deliveryService.updateCourierLocation(body.courierId, body.latitude, body.longitude)
  }

  @Get('courier/stats')
  @ApiOperation({ summary: 'Estatísticas do entregador' })
  getStats(@Request() req: { user: { sub: string } }, @Body() body: { courierId: string }) {
    return this.deliveryService.getCourierStats(body.courierId)
  }
}

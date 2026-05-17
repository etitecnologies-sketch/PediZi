import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CouponsService } from './coupons.service'

@ApiTags('coupons')
@Controller({ path: 'coupons', version: '1' })
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Criar cupom' })
  create(@Body() body: any) {
    return this.couponsService.create(body)
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validar cupom' })
  validate(@Query('code') code: string, @Query('restaurantId') restaurantId: string, @Query('subtotal') subtotal: number) {
    return this.couponsService.validate(code, restaurantId, Number(subtotal))
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Cupons do restaurante' })
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.couponsService.findByRestaurant(restaurantId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Desativar cupom' })
  deactivate(@Param('id') id: string) {
    return this.couponsService.deactivate(id)
  }
}

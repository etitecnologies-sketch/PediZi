import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ReviewsService } from './reviews.service'

@ApiTags('reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Avaliar pedido' })
  create(@Request() req: { user: { sub: string } }, @Body() body: { orderId: string; restaurantRating: number; courierRating?: number; comment?: string }) {
    return this.reviewsService.create(req.user.sub, body)
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Avaliações do restaurante' })
  findByRestaurant(@Param('restaurantId') restaurantId: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.reviewsService.findByRestaurant(restaurantId, { page: Number(page), limit: Number(limit) })
  }
}

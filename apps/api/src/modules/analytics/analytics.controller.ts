import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/guards/roles.guard'
import { AnalyticsService } from './analytics.service'

@ApiTags('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin/dashboard')
  @UseGuards(RolesGuard)
  @Roles('ADMIN' as any)
  @ApiOperation({ summary: 'Dashboard KPIs admin' })
  getAdminDashboard() {
    return this.analyticsService.getAdminDashboard()
  }

  @Get('admin/revenue')
  @UseGuards(RolesGuard)
  @Roles('ADMIN' as any)
  @ApiOperation({ summary: 'Receita mensal (12 meses)' })
  getMonthlyRevenue() {
    return this.analyticsService.getMonthlyRevenue()
  }

  @Get('admin/top-restaurants')
  @UseGuards(RolesGuard)
  @Roles('ADMIN' as any)
  @ApiOperation({ summary: 'Ranking restaurantes' })
  getTopRestaurants(@Query('limit') limit = 10) {
    return this.analyticsService.getTopRestaurants(Number(limit))
  }

  @Get('restaurant/:id')
  @ApiOperation({ summary: 'Analytics do restaurante' })
  getRestaurantAnalytics(@Param('id') id: string, @Query('period') period: 'week' | 'month' | 'year' = 'month') {
    return this.analyticsService.getRestaurantAnalytics(id, period)
  }
}

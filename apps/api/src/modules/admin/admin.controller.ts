import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/guards/roles.guard'
import { AdminService } from './admin.service'

@ApiTags('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN' as any)
@ApiBearerAuth('JWT')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('restaurants/pending')
  @ApiOperation({ summary: 'Restaurantes pendentes de aprovação' })
  getPendingRestaurants() {
    return this.adminService.getRestaurantsPendingApproval()
  }

  @Patch('restaurants/:id/approve')
  @ApiOperation({ summary: 'Aprovar restaurante' })
  approveRestaurant(@Param('id') id: string) {
    return this.adminService.approveRestaurant(id)
  }

  @Patch('restaurants/:id/reject')
  @ApiOperation({ summary: 'Rejeitar restaurante' })
  rejectRestaurant(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.adminService.rejectRestaurant(id, body.reason)
  }

  @Patch('restaurants/:id/suspend')
  @ApiOperation({ summary: 'Suspender restaurante' })
  suspendRestaurant(@Param('id') id: string) {
    return this.adminService.suspendRestaurant(id)
  }

  @Get('couriers/pending')
  @ApiOperation({ summary: 'Entregadores pendentes de aprovação' })
  getPendingCouriers() {
    return this.adminService.getCouriersPendingApproval()
  }

  @Patch('couriers/:id/approve')
  @ApiOperation({ summary: 'Aprovar entregador' })
  approveCourier(@Param('id') id: string) {
    return this.adminService.approveCourier(id)
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar usuários' })
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers({ page: Number(page), limit: Number(limit), role, search })
  }

  @Patch('users/:id/toggle-status')
  @ApiOperation({ summary: 'Ativar/desativar usuário' })
  toggleUserStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id)
  }

  @Get('financials')
  @ApiOperation({ summary: 'Financeiro da plataforma' })
  getFinancials(@Query('period') period: 'month' | 'year' = 'month') {
    return this.adminService.getPlatformFinancials(period)
  }
}

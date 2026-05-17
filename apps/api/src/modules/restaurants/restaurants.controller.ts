import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/guards/roles.guard'
import { RestaurantsService } from './restaurants.service'

@ApiTags('restaurants')
@Controller({ path: 'restaurants', version: '1' })
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar restaurantes próximos' })
  findNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.restaurantsService.findNearby({ latitude, longitude, search, page: Number(page), limit: Number(limit) })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do restaurante' })
  findById(@Param('id') id: string) {
    return this.restaurantsService.findById(id)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Buscar por slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.restaurantsService.findBySlug(slug)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT_OWNER' as any)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Cadastrar restaurante' })
  create(@Request() req: { user: { sub: string } }, @Body() body: any) {
    return this.restaurantsService.create(req.user.sub, body)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Atualizar restaurante' })
  update(@Param('id') id: string, @Request() req: { user: { sub: string } }, @Body() body: any) {
    return this.restaurantsService.update(id, req.user.sub, body)
  }

  @Patch(':id/toggle-open')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Abrir/fechar restaurante' })
  toggleOpen(@Param('id') id: string, @Request() req: { user: { sub: string } }) {
    return this.restaurantsService.toggleOpen(id, req.user.sub)
  }

  @Get(':id/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Dashboard do restaurante' })
  getDashboard(@Param('id') id: string, @Request() req: { user: { sub: string } }) {
    return this.restaurantsService.getDashboardStats(id, req.user.sub)
  }
}

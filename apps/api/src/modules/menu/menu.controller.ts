import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { MenuService } from './menu.service'

@ApiTags('menu')
@Controller({ path: 'restaurants/:restaurantId/menu', version: '1' })
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Cardápio do restaurante' })
  getMenu(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getCategories(restaurantId)
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Criar categoria' })
  createCategory(@Param('restaurantId') restaurantId: string, @Body() body: { name: string; description?: string }) {
    return this.menuService.createCategory(restaurantId, body)
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Criar item' })
  createItem(@Param('restaurantId') restaurantId: string, @Body() body: any) {
    return this.menuService.createItem(restaurantId, body)
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Atualizar item' })
  updateItem(@Param('restaurantId') restaurantId: string, @Param('id') id: string, @Body() body: any) {
    return this.menuService.updateItem(id, restaurantId, body)
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Remover item' })
  deleteItem(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    return this.menuService.deleteItem(id, restaurantId)
  }

  @Patch('items/:id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Ativar/desativar item' })
  toggleItem(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    return this.menuService.toggleAvailability(id, restaurantId)
  }
}

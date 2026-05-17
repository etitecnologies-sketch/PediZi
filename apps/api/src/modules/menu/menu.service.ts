import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(restaurantId: string, data: { name: string; description?: string; sortOrder?: number }) {
    return this.prisma.menuCategory.create({ data: { restaurantId, ...data } })
  }

  async getCategories(restaurantId: string) {
    return this.prisma.menuCategory.findMany({
      where: { restaurantId, isActive: true },
      include: { items: { where: { isAvailable: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    })
  }

  async createItem(restaurantId: string, data: {
    categoryId: string; name: string; description?: string; price: number
    imageUrl?: string; preparationTime?: number; sortOrder?: number
  }) {
    return this.prisma.menuItem.create({
      data: { restaurantId, ...data },
      include: { variations: true, additionals: true },
    })
  }

  async updateItem(id: string, restaurantId: string, data: Partial<{
    name: string; description: string; price: number; isAvailable: boolean
    imageUrl: string; categoryId: string; sortOrder: number
  }>) {
    const item = await this.prisma.menuItem.findFirst({ where: { id, restaurantId } })
    if (!item) throw new NotFoundException('Item não encontrado')
    return this.prisma.menuItem.update({ where: { id }, data })
  }

  async deleteItem(id: string, restaurantId: string) {
    const item = await this.prisma.menuItem.findFirst({ where: { id, restaurantId } })
    if (!item) throw new NotFoundException('Item não encontrado')
    return this.prisma.menuItem.delete({ where: { id } })
  }

  async toggleAvailability(id: string, restaurantId: string) {
    const item = await this.prisma.menuItem.findFirst({ where: { id, restaurantId } })
    if (!item) throw new NotFoundException('Item não encontrado')
    return this.prisma.menuItem.update({ where: { id }, data: { isAvailable: !item.isAvailable } })
  }

  async addVariation(menuItemId: string, data: { name: string; price: number; isDefault?: boolean }) {
    return this.prisma.menuItemVariation.create({ data: { menuItemId, ...data } })
  }

  async addAdditional(menuItemId: string, data: { name: string; price: number }) {
    return this.prisma.menuItemAdditional.create({ data: { menuItemId, ...data } })
  }
}

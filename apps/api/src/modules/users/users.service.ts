import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../infra/database/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
        addresses: true,
      },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }

  async findAll(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params
    const skip = (page - 1) * limit

    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }
      : {}

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 },
    }
  }

  async update(id: string, data: { name?: string; phone?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true },
    })
  }

  async createAddress(userId: string, data: {
    label?: string; street: string; number: string; complement?: string
    neighborhood: string; city: string; state: string; zipCode: string
    latitude?: number; longitude?: number; isDefault?: boolean
  }) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
    }
    return this.prisma.address.create({ data: { userId, ...data } })
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } })
  }

  async deleteAddress(userId: string, addressId: string) {
    return this.prisma.address.deleteMany({ where: { id: addressId, userId } })
  }
}

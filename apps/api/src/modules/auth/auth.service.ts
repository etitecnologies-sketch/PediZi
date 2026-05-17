import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'

import { PrismaService } from '../../infra/database/prisma/prisma.service'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existingUser) throw new ConflictException('Este e-mail já está em uso')

    const passwordHash = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role || 'CLIENT',
      },
    })

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSensitiveData } = user
    return { user: userWithoutSensitiveData, ...tokens }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user || !user.passwordHash) throw new UnauthorizedException('Credenciais inválidas')
    if (!user.isActive) throw new UnauthorizedException('Conta desativada')

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas')

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSensitiveData } = user
    return { user: userWithoutSensitiveData, ...tokens }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Acesso negado')

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash)
    if (!isValid) throw new UnauthorizedException('Token inválido')

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    })
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) return null

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) return null

    return user
  }

  async googleLogin(googleUser: { googleId: string; email: string; name: string; avatarUrl?: string }) {
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.googleId,
          avatarUrl: googleUser.avatarUrl,
          isEmailVerified: true,
          role: 'CLIENT',
        },
      })
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.googleId, isEmailVerified: true },
      })
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role }

    const jwtOpts1: any = { secret: this.configService.get('JWT_SECRET', 'fallback'), expiresIn: '15m' }
    const jwtOpts2: any = { secret: this.configService.get('JWT_REFRESH_SECRET', 'fallback-r'), expiresIn: '7d' }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload as any, jwtOpts1),
      this.jwtService.signAsync(payload as any, jwtOpts2),
    ])

    return { accessToken, refreshToken, expiresIn: 900 }
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    })
  }
}

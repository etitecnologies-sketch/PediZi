import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PrismaService } from '../../infra/database/prisma/prisma.service'

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check da API' })
  async check() {
    let dbStatus = 'ok'
    try {
      await this.prisma.$queryRaw`SELECT 1`
    } catch {
      dbStatus = 'error'
    }

    return {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: { api: 'ok', database: dbStatus },
    }
  }
}

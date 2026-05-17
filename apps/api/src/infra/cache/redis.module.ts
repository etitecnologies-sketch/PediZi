import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const { default: Redis } = await import('ioredis')

        // Upstash usa URL com TLS (rediss://...)
        const redisUrl = configService.get<string>('REDIS_URL')
        if (redisUrl) {
          return new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            enableReadyCheck: false,
            lazyConnect: true,
          })
        }

        // Configuração manual (host/port)
        return new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          tls: configService.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
          maxRetriesPerRequest: 3,
          enableReadyCheck: false,
          lazyConnect: true,
        })
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}

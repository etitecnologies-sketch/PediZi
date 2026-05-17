import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  const configService = app.get(ConfigService)
  const port = configService.get<number>('APP_PORT', 3333)
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000')
  const adminUrl = configService.get<string>('ADMIN_URL', 'http://localhost:3001')
  const restaurantUrl = configService.get<string>('RESTAURANT_URL', 'http://localhost:3002')

  app.use(helmet())

  app.enableCors({
    origin: [frontendUrl, adminUrl, restaurantUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })

  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PEDIZI API')
    .setDescription('API oficial do PEDIZI — O delivery da sua cidade.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('restaurants', 'Gerenciamento de restaurantes')
    .addTag('menu', 'Cardápio dos restaurantes')
    .addTag('orders', 'Pedidos')
    .addTag('payments', 'Pagamentos')
    .addTag('delivery', 'Entregas e entregadores')
    .addTag('coupons', 'Cupons de desconto')
    .addTag('reviews', 'Avaliações')
    .addTag('notifications', 'Notificações')
    .addTag('analytics', 'Analytics e métricas')
    .addTag('admin', 'Painel administrativo')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  })

  await app.listen(port)
  console.warn(`🚀 PEDIZI API rodando em: http://localhost:${port}/api/v1`)
  console.warn(`📚 Swagger: http://localhost:${port}/api/docs`)
}

bootstrap()

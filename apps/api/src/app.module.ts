import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import { PrismaModule } from './infra/database/prisma/prisma.module'
import { RedisModule } from './infra/cache/redis.module'
import { RealtimeModule } from './infra/realtime/realtime.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { RestaurantsModule } from './modules/restaurants/restaurants.module'
import { MenuModule } from './modules/menu/menu.module'
import { OrdersModule } from './modules/orders/orders.module'
import { PaymentsModule } from './modules/payments/payments.module'
import { DeliveryModule } from './modules/delivery/delivery.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { CouponsModule } from './modules/coupons/coupons.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module'
import { AdminModule } from './modules/admin/admin.module'
import { UploadModule } from './modules/upload/upload.module'
import { HealthModule } from './modules/health/health.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),

    // Infraestrutura (global)
    PrismaModule,
    RedisModule,
    RealtimeModule,

    // Módulos de negócio
    AuthModule,
    UsersModule,
    RestaurantsModule,
    MenuModule,
    OrdersModule,
    PaymentsModule,
    DeliveryModule,
    NotificationsModule,
    CouponsModule,
    ReviewsModule,
    AnalyticsModule,
    SubscriptionsModule,
    AdminModule,
    UploadModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

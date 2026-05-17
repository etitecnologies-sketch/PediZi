import { Injectable, Inject, Logger } from '@nestjs/common'
import type { Redis } from 'ioredis'

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name)

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  // ── TTLs padrão (em segundos) ─────────────────────────
  private readonly TTL = {
    RESTAURANT: 300,    // 5 minutos
    RESTAURANT_MENU: 600, // 10 minutos
    USER: 120,          // 2 minutos
    ORDER: 30,          // 30 segundos
    COUPON: 3600,       // 1 hora
    ANALYTICS: 60,      // 1 minuto
  }

  // ── Operações básicas ────────────────────────────────
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key)
      return data ? (JSON.parse(data) as T) : null
    } catch (error) {
      this.logger.error(`Redis GET error [${key}]:`, error)
      return null
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        await this.redis.setex(key, ttl, serialized)
      } else {
        await this.redis.set(key, serialized)
      }
    } catch (error) {
      this.logger.error(`Redis SET error [${key}]:`, error)
    }
  }

  async del(key: string | string[]): Promise<void> {
    try {
      if (Array.isArray(key)) {
        await this.redis.del(...key)
      } else {
        await this.redis.del(key)
      }
    } catch (error) {
      this.logger.error(`Redis DEL error:`, error)
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) await this.redis.del(...keys)
    } catch (error) {
      this.logger.error(`Redis INVALIDATE error [${pattern}]:`, error)
    }
  }

  // ── Cache de Restaurante ───────────────────────────────
  async getRestaurant(id: string) {
    return this.get(`restaurant:${id}`)
  }

  async setRestaurant(id: string, data: unknown) {
    await this.set(`restaurant:${id}`, data, this.TTL.RESTAURANT)
  }

  async invalidateRestaurant(id: string) {
    await this.del([`restaurant:${id}`, `restaurant:menu:${id}`, `restaurants:nearby:*`])
    await this.invalidatePattern(`restaurants:nearby:*`)
  }

  // ── Cache de Cardápio ─────────────────────────────────
  async getMenu(restaurantId: string) {
    return this.get(`restaurant:menu:${restaurantId}`)
  }

  async setMenu(restaurantId: string, data: unknown) {
    await this.set(`restaurant:menu:${restaurantId}`, data, this.TTL.RESTAURANT_MENU)
  }

  // ── Cache de Pedido ───────────────────────────────────
  async getOrder(id: string) {
    return this.get(`order:${id}`)
  }

  async setOrder(id: string, data: unknown) {
    await this.set(`order:${id}`, data, this.TTL.ORDER)
  }

  async invalidateOrder(id: string) {
    await this.del(`order:${id}`)
  }

  // ── Rate Limiting ─────────────────────────────────────
  async checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const redisKey = `ratelimit:${key}`
    const current = await this.redis.incr(redisKey)

    if (current === 1) {
      await this.redis.expire(redisKey, windowSeconds)
    }

    const ttl = await this.redis.ttl(redisKey)
    const remaining = Math.max(0, limit - current)
    const resetAt = Date.now() + ttl * 1000

    return { allowed: current <= limit, remaining, resetAt }
  }

  // ── Sessão / Dados temporários ────────────────────────
  async setTemp(key: string, value: unknown, ttlSeconds: number) {
    await this.set(`temp:${key}`, value, ttlSeconds)
  }

  async getTemp<T>(key: string): Promise<T | null> {
    return this.get<T>(`temp:${key}`)
  }

  // ── Health check ───────────────────────────────────────
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping()
      return result === 'PONG'
    } catch {
      return false
    }
  }
}

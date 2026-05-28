import Redis from 'ioredis'
import { env } from '../../config/env'
import { logger } from '../../shared/logger'

export let redis: Redis

export function createRedisClient(): Redis {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })

  redis.on('connect', () => logger.info('Redis connected'))
  redis.on('error', (err) => logger.error('Redis error', err))

  return redis
}

export async function connectRedis(): Promise<void> {
  if (!redis) createRedisClient()
  await redis.connect()
}

export async function disconnectRedis(): Promise<void> {
  if (redis) await redis.quit()
}

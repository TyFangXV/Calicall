import redis from 'ioredis'

export const redisClient = new redis(6379);
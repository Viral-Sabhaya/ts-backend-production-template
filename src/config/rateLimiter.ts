import { Connection } from 'mongoose'
import { RateLimiterMongo } from 'rate-limiter-flexible'

export let rateLimiterMongo: null | RateLimiterMongo = null

export const initRateLimiter = (mongooseConnection: Connection) => {
  rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongooseConnection,
    points: 60,
    duration: 10
  })
}
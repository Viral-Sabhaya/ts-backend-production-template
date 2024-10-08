import { NextFunction, Request, Response } from 'express';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';
import httpError from '../util/httpError';
import { rateLimiterMongo } from '../config/rateLimiter';
import responseMessage from '../constant/responseMessage';

export default (req: Request, _res: Response, next: NextFunction) => {
  // Skip rate-limiting in development environment
  if (config.env === EApplicationEnvironment.DEVELOPMENT) {
    return next();
  }

  // If the rate limiter is available, use it
  if (rateLimiterMongo) {
    rateLimiterMongo
      .consume(req.ip as string, 1) // Consume 1 token for each request based on the request IP
      .then(() => {
        next(); // Allow the request to proceed if within the limit
      })
      .catch(() => {
        httpError(next, new Error(responseMessage.TOO_MANY_REQUESTS), req, 429);
      });
  } else {
    // If no rate limiter is configured, simply call next()
    next();
  }
};

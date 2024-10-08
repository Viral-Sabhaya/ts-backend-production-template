import app from './app'
import config from './config/config'
import { initRateLimiter } from './config/rateLimiter';
import dataBaseService from './service/dataBaseService';
import logger from './util/logger';

const server = app.listen(config.port)
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  ; (async () => {
    try {
      const connection = await dataBaseService.connect();
      logger.info('DATABASE_CONNECTION', {
        meta: {
          CONNECTION_NAME: connection.name
        }
      })

      initRateLimiter(connection)
      logger.info('RATE_LIMITER_INITIATED:')
      // database connection
      logger.info('APPLICATION_STARTED:', {
        meta: {
          PORT: config.port,
          SERVER_URL: config.server_url,
        }
      })
    } catch (err) {
      logger.error('APPLICATION_ERROR:', { meta: err });

      server.close((error: unknown) => {
        if (error) {
          logger.error('APPLICATION_ERROR:', { meta: error })
        }
        process.exit(1)
      })
    }
  })()


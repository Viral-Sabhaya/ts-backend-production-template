import app from './app'
import config from './config/config'
import logger from './util/logger';

const server = app.listen(config.port)
  ; (() => {
    try {
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


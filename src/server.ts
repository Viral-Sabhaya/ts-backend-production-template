import app from './app'
import config from './config/config'

const server = app.listen(config.port)
  ; (() => {
    try {
      // database connection
      // eslint-disable-next-line no-console
      console.info('APPLICATION_STARTED:', {
        meta: {
          PORT: config.port,
          SERVER_URL: config.server_url,
        }
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('APPLICATION_ERROR:', { meta: error });
      server.close((err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('APPLICATION_ERROR:', { meta: err })
        }
        process.exit(1)
      })
    }
  })()


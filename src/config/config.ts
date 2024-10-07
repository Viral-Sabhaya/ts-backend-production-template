import dotenvFlow from 'dotenv-flow';
dotenvFlow.config()

export default {
  // General
  env: process.env.ENV,
  port: process.env.PORT,
  server_url: process.env.SERVER_URL,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,
}
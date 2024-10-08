import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path';
import router from './router/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constant/responseMessage';
import httpError from './util/httpError';
import helmet from 'helmet';
import cors from 'cors'

const app: Application = express();

// helmet
app.use(helmet())

// cors
app.use(cors({
  methods: ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'],
  origin: ['http://localhost:4200'],
  credentials: true
}))

// middleware
app.use(express.json()); // use for fetch json data
app.use(express.static(path.join(__dirname, '../public'))) // user for use static file

//router
app.use('/api/v1', router)

// 404 handler
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(responseMessage.NOT_FOUND('route'))
  } catch (error) {
    httpError(next, error, req, 404)
  }
})

// Global error handler
app.use(globalErrorHandler)
export default app;
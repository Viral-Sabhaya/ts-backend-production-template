import { Request, Response } from 'express';
import { THttpResponse } from '../types/types';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null): void => {
  const response: THttpResponse = {
    success: true,
    status: responseStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.url
    },
    message: responseMessage,
    data: data
  }

  // Production Env check
  if (config.env === EApplicationEnvironment.PRODUCTION) {
    delete response.request.ip
  }

  // Log for response
  // eslint-disable-next-line no-console
  console.info('CONTROLLER_RESPONSE', {
    meta: response
  })

  res.status(responseStatusCode).json(response)
}
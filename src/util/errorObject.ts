import { Request } from 'express';
import { THttpError } from '../types/types';
import responseMessage from '../constant/responseMessage';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';
import logger from './logger';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THttpError => {
  const errorObj: THttpError = {
    success: false,
    status: errorStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.url
    },
    message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null
  }
  // Production Env check
  if (config.env === EApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip
    delete errorObj.trace
  }

  // Log for response
  logger.info('CONTROLLER_ERROR', {
    meta: errorObj
  })
  return errorObj;
}
import { ServerError } from '../common/error'
import { failureResponse, serverErrorResponse } from '../common/responses';

/**
 * 
 * @param {Error} err 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export const handleAPIError = (err, req, res, next) => {
  if (err) {
    if (err instanceof ServerError) {
      const { status, message, data } = err;
      if (status === 200) return failureResponse(res, { message, data });
      return serverErrorResponse(res, status, { message, data });
    }
    console.error('[ERROR]', err);
    return serverErrorResponse(res, 500, { message: 'Internal Server Error' });
  }
  return next();
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export const handleNotFoundError = (req, res, next) => {
  serverErrorResponse(res, 404, { message: `Endpoint ${req.method} ${req.url} not found` });
  return next();
}

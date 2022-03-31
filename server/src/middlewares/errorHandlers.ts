import { NextFunction, Request, Response } from "express";
import { ServerError } from '../common/error'
import { failureResponse, serverErrorResponse } from '../common/responses';

export const handleAPIError = (err: Error, req: Request, res: Response, next: NextFunction) => {
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

export const handleNotFoundError = (req: Request, res: Response, next: NextFunction) => {
  serverErrorResponse(res, 404, { message: `Endpoint ${req.method} ${req.url} not found` });
  return next();
}

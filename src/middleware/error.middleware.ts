import HttpException from '../exceptions/HttpException';
import { Request, Response, NextFunction } from 'express';
import Log from '../utils/Log';
import { ERROR_MESSAGE } from '../consts/ErrorMessage';

// eslint-disable-next-line
export const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
  const status = error.statusCode || 500;
  Log.error('middleware', 'errorHandler', error, { json: true, jwtPayload: res?.locals?.jwtPayload, req: req });

  const meesage = error.message || ERROR_MESSAGE.SYSTEM_ERROR;
  res.status(status).json({ message: meesage });
};

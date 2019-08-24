import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import * as config from '../config';
import logger from '../logger';

import Locale from '../locale';
import { CustomRequest } from "../types";

/**
 * Create a new user and save to the database
 * After registered, a confirmation's email is sent
 *
 * @param {string} token: Token to decode
 * @param {string} jwtSecret: Secret key used to create the token
 *
 * @return Promise<any>
 */
export const decodeJwtToken = (token: string, jwtSecret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors, decoded: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
};

/**
 * Middleware to authorize a request only if a valid token is provided
 *
 * @param {Request|any} req: Request object
 * @param {Response} res: Response object
 * @param {NextFunction} next: NextFunction object
 *
 * @return any
 */
const authenticated = (req: CustomRequest|any, res: Response, next: NextFunction) => {
  const token: any = req.headers['x-access-token'];

  const allowedRoutes = [
    '/',
    '/api/documentation',
    'auth/login',
    'auth/register',
    'auth/account/confirm',
    'auth/password/forgot',
    'auth/password/reset',
    'token/refresh'
  ];

  let routeName = null;
  if (req.originalUrl) {
    routeName = req.originalUrl.replace(config.API_BASE || '', '');
  } else {
    return res.status(401).json({ message: Locale.trans('unauthorized') });
  }

  if (allowedRoutes.indexOf(routeName) >= 0) {
    return next();
  }

  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err: jwt.VerifyErrors, decoded: any) => {
      if (err) {
        logger.error(err);
        return res.status(401).json({ message: Locale.trans('unauthorized') });
      }

      if (!decoded.id) {
        return res.status(401).json({ message: Locale.trans('unauthorized') });
      }

      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      return next();
    });
  } else {
    return res.status(401).json({ message: Locale.trans('unauthorized') });
  }
};

export default authenticated;

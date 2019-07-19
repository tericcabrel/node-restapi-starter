import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import * as config from '../config';
import logger from '../logger';

import Locale from '../locale';
import { CustomRequest } from "../types";

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
    const jwtSecret = config.JWT_SECRET || 'sdhsQWUQTEpeorne96$';
    jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors, decoded: any) => {
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

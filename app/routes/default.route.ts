import { Router, Request, Response, NextFunction } from "express";
import * as path from 'path';

import Locale from '../core/locale';
import { internalError } from '../core/utils/helpers';

/**
 * Router configuration for common route
 *
 * @class
 */
export default class DefaultRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get('/', (req, res) => {
      res.json(Locale.trans('welcome'));
    });

    this.router.get('/api/documentation', (req, res) => {
      res.sendFile(path.join(__dirname, '../../public/apidoc/index.html'));
    });

    this.router.use((error: any, req: Request, res: Response, next: NextFunction) => {
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: internalError() });
      }
      return next(error);
    });
  }
}

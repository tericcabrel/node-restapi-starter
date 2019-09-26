import * as express from 'express';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as path from 'path';
import swig from 'swig';


import * as config from '../core/config';

import DefaultRouter from './default.route';
import AuthRouter from './auth.route';
import UserRouter from './user.route';
import TaskRouter from './task.route';

import localMiddleware from '../core/middleware/locale';
import authMiddleware from '../core/middleware/auth';

/**
 * Global router configuration of the application
 *
 * @class
 */
export default class Routes {
  /**
   * @param  {Application} app
   *
   * @returns void
   */
  static init(app: express.Application): void {
    const router: express.Router = express.Router();

    // Express middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(helmet());
    app.use(cors());

    app.engine('html', swig.renderFile);

    app.set('view engine', 'html');
    app.set('views', path.resolve(__dirname, '../views'));

    // Swig will cache templates for you, but you can disable
    // that and use Express's caching instead, if you like:
    app.set('view cache', false);

    // To disable Swig's cache, do the following:
    swig.setDefaults({ cache: false });
    // NOTE: You should always cache templates in a production environment.

    app.use(localMiddleware);

    if (config.AUTH_ENABLED === 'true') {
      app.use(authMiddleware);
    }

    app.use('/', router);
    // default
    app.use('/', new DefaultRouter().router);
    // auth
    app.use('/', new AuthRouter().router);
    // users
    app.use('/', new UserRouter().router);
    // tasks
    app.use('/', new TaskRouter().router);

    // Static content
    app.use(express.static(path.join(__dirname, '../public')));
  }
}

import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';

import { APP_NAME } from '../core/config';
import { internalError } from '../utils/helpers';

/**
 * Router configuration for common route
 *
 * @class
 */
class DefaultRoute {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
			res.render('index', { appName: APP_NAME });
		});

		this.router.get('/api/documentation', (req: Request, res: Response, next: NextFunction) => {
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

export { DefaultRoute };

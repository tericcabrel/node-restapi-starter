import * as http from 'http';
import express, { Application } from 'express';
import * as config from './core/config';

import { Routes } from './routes';
import { SocketManager } from './core/socket';
import { Locale } from './core/locale';
import { logger } from './core/logger';
import { dbConnection } from './core/db/connect';

const port: number = config.SERVER_PORT;

const app: Application = express();

// Cron.init();
Routes.init(app);

const server: http.Server = http.createServer(app);

SocketManager.init(server);

server.listen(port, async() => {
	await dbConnection();

	Locale.init();

	logger.info(`Server started - ${port}`);
});

export { server };

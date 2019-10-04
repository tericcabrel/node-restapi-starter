import path from 'path';
import * as fs from 'fs';
import { createLogger, format, transports, Logger } from 'winston';

import * as config from '../config';

const { combine, timestamp, printf }: any = format;
const t: any = require('winston-daily-rotate-file');

const logFileDir: string|undefined = config.LOG_FILE_DIR;
const dir: string = logFileDir !== undefined ? path.join(__dirname, logFileDir) : '';

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

const transport: any = new (t)({
	dirname: dir,
	filename: 'logs/app-%DATE%.log',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d',
});

transport.on('rotate', (oldFilename: string, newFilename: string) => {
	// do something fun
});

const myFormat: any = printf(({ level, message, label, timestamp }: any) => {
	return `${timestamp} ${level}: ${message}`; // `${timestamp}[${level}]- ${message}`;
});

const logger: Logger = createLogger({
	format: combine(
		timestamp(),
		myFormat,
	),
	transports: [
		transport,
		new transports.Console(),
	],
});

export { logger };

import path from 'path';
import * as fs from 'fs';
import { createLogger, format, transports } from 'winston';

import * as config from '../config';

const { combine, timestamp, printf } = format;
const t = require('winston-daily-rotate-file');

const logFileDir: string|undefined = config.LOG_FILE_DIR;
const dir: string = logFileDir !== undefined ? path.join(__dirname, logFileDir) : '';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const transport = new (t)({
  dirname: dir,
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

transport.on('rotate', function(oldFilename: string, newFilename: string) {
  // do something fun
});

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`; // `${timestamp}[${level}]- ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    transport,
    new transports.Console(),
  ]
});

export default logger;

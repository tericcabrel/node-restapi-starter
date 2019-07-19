import { Request, Application } from 'express';

export type ApplicationConfiguration = {
  BASE_URL: string,
  SERVER_PORT: string,
  APP_NAME: string,
  APP_VERSION: string,
  API_BASE: string,
  DEFAULT_TIMEZONE: string,
  AUTH_ENABLED: string,
  JWT_SECRET: string,
  JWT_EXPIRE: string,
  DB_HOST: string,
  DB_PORT: string,
  DB_NAME: string,
  DB_USER: string,
  DB_PASSWORD: string,
  DB_AUTH: string,
  LOG_FILE_NAME: string,
  LOG_FILE_DIR: string,
  MAIL_USERNAME: string,
  MAIL_PASSWORD: string,
  MAIL_HOST: string,
  MAIL_PORT: string,
  WEB_APP_URL: string,
  RESET_PASSWORD_PATH: string,
  CONFIRM_ACCOUNT_PATH: string
};

export interface CustomRequest extends Request {
  userId: number;
}

export type TokenInfo = {
  id: string;
}

export type Locales = {
  [string: string]: {
    [string: string]: string
  }
};

export interface IServer {
  app: Application;
}

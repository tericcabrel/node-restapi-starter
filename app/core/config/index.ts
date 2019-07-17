import * as dotenv from "dotenv";

dotenv.config();

let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../envs/.env.test`;
    break;
  case "prod":
    path = `${__dirname}/../../envs/.env.prod`;
    break;
  default:
    path = `${__dirname}/../../envs/.env.dev`;
}

dotenv.config({ path: path });

export const APP_ID = process.env.APP_ID;
export const LOG_LEVEL = process.env.LOG_LEVEL;

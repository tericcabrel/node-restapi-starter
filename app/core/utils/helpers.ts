import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';
import * as express from 'express';

import Locale from '../locale';
import { REGEX } from './constants';
import { CustomRequest } from "../types";

const uploadHandler = require('./uploadHandler');

export const internalError = () => {
  return Locale.trans('internal.error');
};

export const existMessage = (modelName: string) => {
  return Locale.trans('model.exist', { model: modelName });
};

export const notFound = (modelName: string) => {
  return Locale.trans('model.not.found', { model: modelName });
};

export const hashPassword = async (password: string) => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: any, hash: string) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const uploadFile = async (req: any, res: express.Response) => {
  const promise = new Promise((resolve, reject) => {
    uploadHandler(req, res, (error: any) => {
      if (error) {
        return reject(error);
      }
      return resolve(req.file);
    });
  });
  
  return await promise;
};

export const parseRequest = (requestBody: any, objectKeys: string[]) => {
  const result: any = {};

  objectKeys.forEach((key: string) => {
    if (requestBody[key] !== undefined) {
      result[key] = requestBody[key];
    }
  });

  const inputKeys = Object.keys(result);

  return inputKeys.length === 0 ? null : result;
};

export const cleanText = (str: string) => {
  return str.trim().replace(/\\n/g, '');
};

export const isValidIPV4Address = (ipAddress: string) => {
  return REGEX.ipAddress.test(ipAddress);
};

export const getBaseUrlFromRequest = (req: CustomRequest|any) => {
  const port = isValidIPV4Address(req.hostname) || req.hostname === 'localhost' ? `:${process.env.SERVER_PORT}` : '';
  return `${req.protocol}://${req.hostname}${port}`;
};

export const readFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  }
  return null;
};

export const randomStr = (n = 16) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let nChar = 24;

  if (n !== undefined) {
    nChar = n;
  }

  for (let i = 0; i < nChar; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const paginate = (array: any[], limit: number, offset: number) => {
  const result = [];
  const startIndex = limit * (offset - 1);
  const length = startIndex + limit;

  for (let i = startIndex; i < length; i += 1) {
    if (array[i]) {
      result.push(array[i]);
    } else {
      break;
    }
  }

  return result;
};

export const getRandomInt = (min: number, max: number) => {
  const borne = max - (min + 1);
  return Math.floor(Math.random() * (borne + min));
};

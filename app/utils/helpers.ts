import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';
import * as express from 'express';

import Locale from '../core/locale';
import { REGEX } from './constants';
import { CustomRequest } from "../core/types";

const uploadHandler = require('./upload-handler');

/**
 * Translate internal server error
 *
 * @return Object
 */
export const internalError = (): { message: string } => {
  return { message: Locale.trans('internal.error') };
};

/**
 * Translate item existence message
 *
 * @param {string} modelName - Model's name
 *
 * @return string
 */
export const existMessage = (modelName: string): string => {
  return Locale.trans('model.exist', { model: modelName });
};

/**
 * Translate not found message
 *
 * @param {string} modelName - Model's name
 *
 * @return string
 */
export const notFound = (modelName: string): string => {
  return Locale.trans('model.not.found', { model: modelName });
};

/**
 * Hash a password
 *
 * @param {string} password - Password to hash
 *
 * @return Promise<string>
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: any, hash: string) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

/**
 * Delete a file
 *
 * @param {string} filePath - Model's name
 *
 * @return void
 */
export const deleteFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Upload a file
 * @async
 *
 * @param {any} req - body's request
 * @param {Response} res - body's response
 *
 * @return Promise<any>
 */
export const uploadFile = async (req: any, res: express.Response): Promise<any> => {
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

/**
 * Parse the body of the request
 *
 * @param {Object} requestBody - Content of the request's body
 * @param {string[]} objectKeys - Array of valid's key
 *
 * @return Object
 */
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

/**
 * Remove whitespace and line returns in the text
 *
 * @param {string} str - Text to clean
 *
 * @return string
 */
export const cleanText = (str: string) => {
  return str.trim().replace(/\\n/g, '');
};

/**
 * Validate an IP address
 *
 * @param {string} ipAddress - IP address to validate
 *
 * @return boolean
 */
export const isValidIPV4Address = (ipAddress: string): boolean => {
  return REGEX.ipAddress.test(ipAddress);
};

/**
 * Get the base URL of the server application
 *
 * @param {CustomRequest|any} req - Request object
 *
 * @return string
 */
export const getBaseUrlFromRequest = (req: CustomRequest|any): string => {
  const port = isValidIPV4Address(req.hostname) || req.hostname === 'localhost' ? `:${process.env.SERVER_PORT}` : '';
  return `${req.protocol}://${req.hostname}${port}`;
};

/**
 * Read a file
 *
 * @param {string} filePath - Path of the file which we want to read the content
 *
 * @return string|null
 */
export const readFile = (filePath: string): string|null => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  }
  return null;
};

/**
 * Generate a random string
 *
 * @param {string} n=16 - Number of characters of the string
 *
 * @return string
 */
export const randomStr = (n = 16) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < n; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

/**
 * Translate item existence message
 *
 * @param {string} array - Array of data
 * @param {number} limit - Number of element to get
 * @param {number} offset - Index of the array to start retrieving the data
 *
 * @return Object[]
 */
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

/**
 * Generate a random number in a defined interval
 *
 * @param {number} min - Inclusive minimum value
 * @param {number} max - Inclusive maximum value
 *
 * @return number
 */
export const getRandomInt = (min: number, max: number): number => {
  const borne = max - (min + 1);
  return Math.floor(Math.random() * (borne + min));
};

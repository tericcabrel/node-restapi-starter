import { Request, Response, NextFunction } from "express";

import Locale from '../locale';

const localeInterceptor = async (req: Request, res: Response, next: NextFunction) => {
  const language: string = req.headers['accept-language'] || Locale.availables[0];

  Locale.setLocale(Locale.availables.indexOf(language) >= 0 ? language : Locale.availables[0]);

  return next();
};

export default localeInterceptor;

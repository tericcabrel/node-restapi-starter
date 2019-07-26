import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

import UserModel from '../models/user.model';

import * as config from '../core/config';
import Locale from '../core/locale';
import Logger from '../core/logger';
import Mailer from '../core/mailer';
import { internalError } from '../core/utils/helpers';
import { TokenInfo } from "../core/types";

const { JWT_SECRET, JWT_EXPIRE, JWT_EMAIL_SECRET, JWT_EMAIL_EXPIRE } = config;

class AuthController {
  /**
   * register()
   *
   * Create a new user and save to the database
   * After registered, a confirmation's email is sent
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { name, username, email } = req.body;

      const password = bcrypt.hashSync(req.body.password, 10);

      const emailToken = bcrypt.hashSync(email, 8);
      const userParam: any = { name, username, email, password, email_token: emailToken };
      const user: any = new UserModel(userParam);
      await user.save();

      const data = {
        to: user.email,
        subject: 'mail.subject.confirm.account',
        template: 'confirm-account-email',
        context: {
          url: `${process.env.WEB_APP_URL}/${process.env.CONFIRM_ACCOUNT_PATH}/${emailToken}`,
          name: user.name,
          email: user.email,
        },
      };

      Mailer.sendMail(data);

      return res.json({ message: Locale.trans('register.success') });
    } catch (err) {
      Logger.error(err);
      return res.status(500).json(internalError());
    }
  }

  /**
   * login()
   *
   * Login user with email address and password
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { email, password } = req.body;

    try {
      const user: any = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: Locale.trans('login.failed') });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: Locale.trans('login.failed') });
      }

      if (!user.confirmed) {
        return res.status(401).json({ message: Locale.trans('account.unconfirmed') });
      }

      const { _id } = user;
      const tokenInfo: TokenInfo = { id: _id };
      const token = jwt.sign(tokenInfo, JWT_SECRET, { expiresIn: JWT_EXPIRE });
      return res.json({ token, expiresIn: JWT_EXPIRE });
    } catch (err) {
      Logger.error(err);
      return res.status(500).json(internalError());
    }
  }

  /**
   * confirmAccount()
   *
   * Confirm user account with the token sent to his
   * email address after registered
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async confirmAccount(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const token = req.body.token;

      const user: any = await UserModel.getOneBy({ email_token: token });

      if (!user) {
        return res.status(400).json({ message: Locale.trans('bad.token') });
      }

      const { _id } = user;
      await UserModel.change(_id, { confirmed: true, email_token: null });

      return res.json({ message: Locale.trans('account.confirmed') });
    } catch (err) {
      Logger.error(err);
      return res.status(500).json(internalError());
    }
  }

  /**
   * forgotPassword()
   *
   * Sent an email with a token to reset user password
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { email } = req.body;

    try {
      let user: any = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: Locale.trans('no.user') });
      }

      const { _id } = user;
      // const token = bcrypt.hashSync(randomStr(12), 8);
      const tokenInfo: TokenInfo = { id: _id };
      const token = jwt.sign(tokenInfo, JWT_EMAIL_SECRET, { expiresIn: JWT_EMAIL_EXPIRE });
      // const expireDate = Date.now() + jwtExpire;
      //user = await UserModel.change(_id, { reset_token: token, reset_password_expires: expireDate });

      const data = {
        to: user.email,
        subject: 'mail.subject.forgot.password',
        template: 'forgot-password-email',
        context: {
          url: `${process.env.WEB_APP_URL}/${process.env.RESET_PASSWORD_PATH}?token=${token}`,
          name: user.name,
        },
      };

      Mailer.sendMail(data);

      return res.json({ message: Locale.trans('email.success') });
    } catch (err) {
      Logger.error(err);
      return res.status(500).json(internalError());
    }
  }

  /**
   * resetPassword()
   *
   * Reset the password of an user
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
    const resetToken = req.body.reset_token;
    try {
      jwt.verify(resetToken, JWT_EMAIL_SECRET, async (err: jwt.VerifyErrors, decoded: any) => {
        if (err) {
          Logger.error(err);
          return res.status(400).json({ message: Locale.trans('token.expired')});
        }

        const user: any = await UserModel.get(decoded.id);

        if (!user) {
          return res.status(400).json({ message: Locale.trans('bad.token') });
        }

        const password = bcrypt.hashSync(req.body.password, 10);

        const { _id } = user;
        await UserModel.change(_id, { password });

        return res.json({ message: Locale.trans('password.reset') });
      });
    } catch (err) {
      Logger.error(err);
      return res.status(500).json(internalError());
    }
  }
}

export default new AuthController();

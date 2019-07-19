import * as bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from "express";

import UserModel from '../models/user.model';

import Logger from '../core/logger';
import Locale from '../core/locale';
import UserTransformer from '../transformers/user';

import { internalError, parseRequest } from '../core/utils/helpers';
import { CustomRequest } from "../core/types";

class UserController {
  /**
   * me()
   *
   * Get the informations of the user authenticated
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async me(req: CustomRequest|any, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = await UserModel.get(req.userId);

      if (!user) {
        return res.status(404).json({ error: Locale.trans('no.user') });
      }

      const transformer = new UserTransformer(user);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
      return res.status(500).json({ message: internalError() });
    }
  }

  /**
   * all()
   *
   * Get all users in the database
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const users = await UserModel.getAll();

      const transformer = new UserTransformer(users);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
      return res.status(500).json({ message: internalError() });
    }
  }

  /**
   * one()
   *
   * Get an user by it's ID
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async one(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = await UserModel.get(req.params.id);
      if (!user) {
        return res.status(404).json({ message: Locale.trans('model.not.found', { model: 'User' }) });
      }

      const transformer = new UserTransformer(user);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
      return res.status(500).json({ message: internalError() });
    }
  }

  /**
   * updatePassword()
   *
   * Change the password of the user authenticated
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async updatePassword(req: CustomRequest|any, res: Response, next: NextFunction): Promise<any> {
    const id = req.userId;
    const newPassword = req.body.new_password;
    let updatedUser = null;

    try {
      if (req.body.uid !== id) {
        return res.status(403).json({ message: Locale.trans('unauthorized.resource') });
      }

      const user: any = await UserModel.get(id);
      const { _id } = user;
      await UserModel.change(_id, { password: bcrypt.hashSync(newPassword, 10) });
      updatedUser = await UserModel.get(_id);

      const transformer = new UserTransformer(updatedUser);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
      return res.status(500).json({ message: internalError() });
    }
  }

  /**
   * update()
   *
   * Update information of the authenticated user
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async update(req: CustomRequest|any, res: Response, next: NextFunction): Promise<any> {
    const uid = req.body.uid;
    const authUserId = req.userId;
    const data = parseRequest(req.body, UserModel.updateParams);
    let updatedUser = null;

    try {
      if (uid !== authUserId) {
        return res.status(403).json({ message: Locale.trans('unauthorized.resource') });
      }

      if (data !== null) {
        await UserModel.change(uid, data);
      }
      updatedUser = await UserModel.get(uid);

      const transformer = new UserTransformer(updatedUser);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
      return res.status(500).json({ message: internalError() });
    }
  }

  /**
   * destroy()
   *
   * Delete an user in the database
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
  public async destroy(req: CustomRequest|any, res: Response, next: NextFunction): Promise<any> {
    const id = req.params.id;

    try {
      if (req.userId === id) {
        await UserModel.delete(id);
      }

      // TODO check if authenticated user has privilege to delete

      return res.json({ message: Locale.trans('model.deleted', { model: 'User' }) });
    } catch (err) {
      Logger.error(err);
      return res.status(500).json({ message: internalError() });
    }
  }
}

export default new UserController();

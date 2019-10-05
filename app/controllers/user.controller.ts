import * as bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import { CustomRequest } from '../core/types';
import { logger } from '../core/logger';
import { Locale } from '../core/locale';

import { internalError, parseRequest } from '../utils/helpers';

import { Model as UserModel } from '../models/user.model';

import { UserTransformer } from '../transformers/user';

/**
 * Controller for user details
 *
 * @class
 */
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
			const user: Document|null = await UserModel.get(req.userId);

			if (!user) {
				return res.status(404).json({ message: Locale.trans('no.user') });
			}

			const transformer: UserTransformer = new UserTransformer(user);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

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
			const users: Document[] = await UserModel.getAll();

			const transformer: UserTransformer = new UserTransformer(users);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

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
			const user: Document|null = await UserModel.get(req.params.id);

			if (!user) {
				return res.status(404).json({ message: Locale.trans('model.not.found', { model: 'User' }) });
			}

			const transformer: UserTransformer = new UserTransformer(user);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

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
		const id: string = req.userId;
		const newPassword: string = req.body.new_password;
		let updatedUser: Document|null = null;

		try {
			if (req.body.uid !== id) {
				return res.status(403).json({ message: Locale.trans('unauthorized.resource') });
			}

			const user: Document|null = await UserModel.get(id);
			const { _id }: any = user;

			await UserModel.change(_id, { password: bcrypt.hashSync(newPassword, 10) });
			updatedUser = await UserModel.get(_id);

			const transformer: UserTransformer = new UserTransformer(updatedUser);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

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
		const uid: string = req.body.uid;
		const authUserId: string = req.userId;
		const data: any = parseRequest(req.body, UserModel.updateParams);
		let updatedUser: Document|null = null;

		try {
			if (uid !== authUserId) {
				return res.status(403).json({ message: Locale.trans('unauthorized.resource') });
			}

			if (data !== null) {
				await UserModel.change(uid, data);
			}
			updatedUser = await UserModel.get(uid);

			const transformer: UserTransformer = new UserTransformer(updatedUser);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

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
		const id: string = req.params.id;

		try {
			if (req.userId === id) {
				await UserModel.delete(id);
			}

			// TODO check if authenticated user has privilege to delete

			return res.json({ message: Locale.trans('model.deleted', { model: 'User' }) });
		} catch (err) {
			logger.error(err);

			return res.status(500).json({ message: internalError() });
		}
	}
}

export default new UserController();

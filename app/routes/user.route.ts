import { Router } from 'express';

import { API_BASE } from '../core/config';

import userValidator from '../validator/user.validator';
import { Validator } from '../validator';

import userController from '../controllers/user.controller';

const { user }: any = Validator.methods;

/**
 * Router configuration for user
 *
 * @class
 */
class UserRoute {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		const prefix: string = `${API_BASE}users`;

		this.router.get(`${prefix}/me`, userController.me);

		this.router.get(`${prefix}`, userController.all);

		this.router.get(`${prefix}/:id`, userController.one);

		this.router.put(`${prefix}`, userValidator.validate(user.updateUser), userController.update);

		this.router.put(`${prefix}/password`, userValidator.validate(user.updateUserPassword), userController.updatePassword);

		this.router.delete(`${prefix}/:id`, userValidator.validate(user.deleteUser), userController.destroy);
	}
}

export { UserRoute };

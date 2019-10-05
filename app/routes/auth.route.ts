import { Router } from 'express';

import { API_BASE } from '../core/config';

import userValidator from '../validator/user.validator';
import { Validator } from '../validator';

import authController from '../controllers/auth.controller';

const { user }: any = Validator.methods;

/**
 * Router configuration for authentication
 *
 * @class
 */
class AuthRoute {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		const prefix: string = `${API_BASE}auth`;

		this.router.post(`${prefix}/register`, userValidator.validate(user.createUser), authController.register);

		this.router.post(`${prefix}/account/confirm`, userValidator.validate(user.confirmAccount), authController.confirmAccount);

		this.router.post(`${prefix}/login`, userValidator.validate(user.loginUser), authController.login);

		this.router.post(`${prefix}/password/forgot`, userValidator.validate(user.forgotPassword), authController.forgotPassword);

		this.router.post(`${prefix}/password/reset`, userValidator.validate(user.resetPassword), authController.resetPassword);

		this.router.post(`${prefix}/token/refresh`, userValidator.validate(user.refreshToken), authController.refreshToken);
	}
}

export { AuthRoute };

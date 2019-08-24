import { Router } from "express";

import AuthController from '../controllers/auth.controller';
import UserValidator from '../validator/user.validator';
import Validator from '../validator';
import { API_BASE } from '../core/config';

const { user } = Validator.methods;

/**
 * Router configuration for authentication
 *
 * @class
 */
export default class AuthRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    const prefix = `${API_BASE}auth`;

    this.router.post(`${prefix}/register`, UserValidator.validate(user.createUser), AuthController.register);

    this.router.post(`${prefix}/account/confirm`, UserValidator.validate(user.confirmAccount), AuthController.confirmAccount);

    this.router.post(`${prefix}/login`, UserValidator.validate(user.loginUser), AuthController.login);

    this.router.post(`${prefix}/password/forgot`, UserValidator.validate(user.forgotPassword), AuthController.forgotPassword);

    this.router.post(`${prefix}/password/reset`, UserValidator.validate(user.resetPassword), AuthController.resetPassword);

    this.router.post(`${prefix}/token/refresh`, UserValidator.validate(user.refreshToken), AuthController.refreshToken);
  }
};

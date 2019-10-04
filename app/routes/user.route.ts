import { Router } from "express";

import UserController from '../controllers/user.controller';
import UserValidator from '../validator/user.validator';
import Validator from '../validator';
import { API_BASE } from '../core/config';

const { user } = Validator.methods;

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
    const prefix = `${API_BASE}users`;

    this.router.get(`${prefix}/me`, UserController.me);

    this.router.get(`${prefix}`, UserController.all);

    this.router.get(`${prefix}/:id`, UserController.one);

    this.router.put(`${prefix}`, UserValidator.validate(user.updateUser), UserController.update);

    this.router.put(`${prefix}/password`, UserValidator.validate(user.updateUserPassword), UserController.updatePassword);

    this.router.delete(`${prefix}/:id`, UserValidator.validate(user.deleteUser), UserController.destroy);
  }
}

export { UserRoute };

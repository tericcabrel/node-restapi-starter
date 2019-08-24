import { Router } from "express";

import TaskController from '../controllers/task.controller';
import TaskValidator from '../validator/task.validator';
import Validator from '../validator';
import { API_BASE } from '../core/config';

const { task } = Validator.methods;

/**
 * Router configuration for task
 *
 * @class
 */
export default class TaskRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    const prefix = `${API_BASE}tasks`;

    this.router.post(`${prefix}/create`, TaskValidator.validate(task.createTask), TaskController.create);

    this.router.put(`${prefix}/:id`, TaskValidator.validate(task.updateTask), TaskController.update);

    this.router.delete(`${prefix}/:id`, TaskController.destroy);

    this.router.get(`${prefix}`, TaskController.all);

    this.router.get(`${prefix}/:id`, TaskController.one);
  }
}

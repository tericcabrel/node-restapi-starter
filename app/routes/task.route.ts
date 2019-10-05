import { Router } from 'express';

import { API_BASE } from '../core/config';

import { Validator } from '../validator';
import taskValidator from '../validator/task.validator';

import taskController from '../controllers/task.controller';

const { task }: any = Validator.methods;

/**
 * Router configuration for task
 *
 * @class
 */
class TaskRoute {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		const prefix: string = `${API_BASE}tasks`;

		this.router.post(`${prefix}/create`, taskValidator.validate(task.createTask), taskController.create);

		this.router.put(`${prefix}/:id`, taskValidator.validate(task.updateTask), taskController.update);

		this.router.delete(`${prefix}/:id`, taskController.destroy);

		this.router.get(`${prefix}`, taskController.all);

		this.router.get(`${prefix}/:id`, taskController.one);
	}
}

export { TaskRoute };

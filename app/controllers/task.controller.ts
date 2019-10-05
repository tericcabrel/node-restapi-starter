import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import { Model as TaskModel } from '../models/task.model';

import { Locale } from '../core/locale';
import { logger } from '../core/logger';
import { TaskTransformer } from '../transformers/task';
import { internalError, parseRequest } from '../utils/helpers';

/**
 * Controller for task
 *
 * @class
 */
class TaskController {
	/**
   * create()
   *
   * Create a new task
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
	public static async create(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const { title, description, date, status, is_important, user }: any = req.body;

			const param: any = { title, description, date, status, is_important, user };
			const task: TaskModel = new TaskModel(param);

			const savedTask: Document = await TaskModel.add(task);

			return res.json(savedTask);
		} catch (err) {
			logger.error(err);

			return res.status(500).json(internalError());
		}
	}

	/**
   * update()
   *
   * Update the information of the task
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
	public static async update(req: Request, res: Response, next: NextFunction): Promise<any> {
		const id: string = req.params.id;
		const data: any = parseRequest(req.body, TaskModel.updateParams);
		let updatedTask: Document|null = null;

		try {
			if (data !== null) {
				await TaskModel.change(id, data);
			}
			updatedTask = await TaskModel.get(id);

			const transformer: TaskTransformer = new TaskTransformer(updatedTask);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

			return res.status(500).json({ message: internalError() });
		}
	}

	/**
   * destroy()
   *
   * Delete a task in the database
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
	public static async destroy(req: Request, res: Response, next: NextFunction): Promise<any> {
		const id: string = req.params.id;

		try {
			await TaskModel.delete(id);

			return res.json({ message: Locale.trans('model.deleted', { model: 'Task' }) });
		} catch (err) {
			logger.error(err);

			return res.status(500).json({ message: internalError() });
		}
	}

	/**
   * all()
   *
   * Get all tasks in the database
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
	public static async all(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const tasks: Document[] = await TaskModel.getAll();

			const transformer: TaskTransformer = new TaskTransformer(tasks);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

			return res.status(500).json({ message: internalError() });
		}
	}

	/**
   * one()
   *
   * Get a task by it's ID
   *
   * @param {Request} req: Request object
   * @param {Response} res: Response object
   * @param {NextFunction} next: NextFunction object
   *
   * @return Object
   */
	public static async one(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const task: Document|null = await TaskModel.get(req.params.id);

			if (!task) {
				return res.status(404).json({
					message: Locale.trans('model.not.found', { model: 'Task' }),
				});
			}

			const transformer: TaskTransformer = new TaskTransformer(task);

			return res.json(await transformer.transform());
		} catch (err) {
			logger.error(err);

			return res.status(500).json({ message: internalError() });
		}
	}
}

export { TaskController };

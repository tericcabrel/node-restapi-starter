import { Request, Response, NextFunction } from "express";

import TaskModel from '../models/task.model';

import Locale from '../core/locale';
import Logger from '../core/logger';
import TaskTransformer from '../transformers/task';
import { internalError, parseRequest } from '../core/utils/helpers';

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
  public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { title, description, date, status, is_important, user } = req.body;

      const param: any = { title, description, date, status, is_important, user };
      const task = new TaskModel(param);

      const savedTask = await TaskModel.add(task);

      return res.json(savedTask);
    } catch (err) {
      Logger.error(err);
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
  public async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    const id = req.params.id;
    const data = parseRequest(req.body, TaskModel.updateParams);
    let updatedTask = null;

    try {
      if (data !== null) {
        await TaskModel.change(id, data);
      }
      updatedTask = await TaskModel.get(id);

      const transformer = new TaskTransformer(updatedTask);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
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
  public async destroy(req: Request, res: Response, next: NextFunction): Promise<any> {
    const id = req.params.id;

    try {
      await TaskModel.delete(id);

      return res.json({ message: Locale.trans('model.deleted', { model: 'Task' }) });
    } catch (err) {
      Logger.error(err);
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
  public async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tasks = await TaskModel.getAll();

      const transformer = new TaskTransformer(tasks);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
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
  public async one(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const task = await TaskModel.get(req.params.id);
      if (!task) {
        return res.status(404).json({ message: Locale.trans('model.not.found', { model: 'Task' }) });
      }

      const transformer = new TaskTransformer(task);
      return res.json(await transformer.transform());
    } catch (err) {
      Logger.error(err);
      return res.status(500).json({ message: internalError() });
    }
  }
}

export default new TaskController();

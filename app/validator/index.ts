import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

interface IValidator {
  validationHandler(req: Request, res: Response, next: NextFunction): Response|NextFunction|void
}

type ValidationResultError = {
  [string: string]: [string]
};

class Validator implements IValidator {
  validationHandler(req: Request, res: Response, next: NextFunction): Response|NextFunction|void {
    const errors = validationResult(req);
    const result: ValidationResultError = { };

    if (!errors.isEmpty()) {
      errors.array().forEach((item) => {
        const { param, msg } = item;

        if (result[param]) {
          result[param].push(msg);
        } else {
          result[param] = [msg];
        }
      });

      return res.status(422).json({ errors: result });
    }

    return next();
  };

  public static methods = {
    user: {
      createUser: 'createUser',
      confirmAccount: 'confirmAccount',
      loginUser: 'loginUser',
      forgotPassword: 'forgotPassword',
      resetPassword: 'resetPassword',
      updateUser: 'updateUser',
      updateUserPassword: 'updateUserPassword',
      deleteUser: 'deleteUser',
      refreshToken: 'refreshToken'
    },
    task: {
      createTask: 'createTask',
      updateTask: 'updateTask',
    },
  };
}

export default Validator;

import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { check } from 'express-validator';
import { Request, Response, NextFunction } from "express";

import Validator from './index';
import User from '../models/user.model';
import Locale from '../core/locale';

export default {
  validate: (method: string) => {
    const validator = new Validator();

    switch (method) {
      case 'createUser': {
        return [
          check('username').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); }),
          check('name').not().isEmpty().withMessage(() => { return Locale.trans('input.empty'); }),
          check('email').not().isEmpty().withMessage(() => { return Locale.trans('input.empty'); })
                              .isEmail()
                              .withMessage(() => { return Locale.trans('email.invalid'); }),
          check('password').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); })
                                  .isLength({ min: 6 })
                                  .withMessage(() => { return Locale.trans('min.length', { value: "6" }); }),
          check('email')
            .custom(async (value: any, { req }: any) => {
              const user = await User.findOne({ email: req.body.email });
              if (user) {
                throw new Error(Locale.trans('input.taken'));
              }
            }),
          check('username')
            .custom(async (value: any, { req }: any) => {
              const user = await User.findOne({ username: req.body.username });
              if (user) {
                throw new Error(Locale.trans('input.taken'));
              }
            }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'confirmAccount': {
        return [
          check('token').not().isEmpty().withMessage(() => { return Locale.trans('input.empty'); }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'loginUser': {
        return [
          check('email').not().isEmpty().withMessage(() => { return Locale.trans('input.empty'); })
            .isEmail()
            .withMessage(() => { return Locale.trans('email.invalid'); }),
          check('password').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'forgotPassword': {
        return [
          check('email').not().isEmpty().withMessage(() => { return Locale.trans('input.empty'); })
            .isEmail()
            .withMessage(() => { return Locale.trans('email.invalid'); }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'resetPassword': {
        return [
          check('reset_token').not().isEmpty().withMessage(() => { return Locale.trans('input.empty'); }),
          check('password').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'updateUser': {
        return [
          check('uid').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); }),
          check('name').optional().not().isEmpty()
                            .withMessage(() => { return Locale.trans('input.empty'); }),
          check('gender').optional().not().isEmpty()
                              .withMessage(() => { return Locale.trans('input.empty'); })
            .isLength({ max: 1 })
            .withMessage(() => { return Locale.trans('max.length', { value: "1" }); }),
          check('username')
            .optional()
            .custom(async (value: any, { req }: any) => {
              const user = await User.findOne({ username: req.body.username });
              // const { _id } = user;
              if (user && user._id.toString() !== req.body.uid) {
                throw new Error(Locale.trans('input.taken'));
              }
            }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'updateUserPassword': {
        return [
          check('uid').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); }),
          check('new_password').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); })
            .isLength({ min: 6 })
            .withMessage(() => { return Locale.trans('min.length', { value: "6" }); }),
          check('password').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); })
            .isLength({ min: 6 })
            .withMessage(() => { return Locale.trans('min.length', { value: "6" }); }),
          check('password')
            .custom(async (value: any, { req }: any) => {
              const user: any = await User.findOne(req.userId);
              const isMatch = bcrypt.compareSync(req.body.password, user.password);
              if (!isMatch) {
                throw new Error(Locale.trans('invalid.password'));
              }
            }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'deleteUser': {
        return [
          check('id').not().isEmpty().withMessage(() => { return Locale.trans('input.required'); }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      case 'refreshToken': {
        return [
          check('token').not().isEmpty().withMessage(() => { return Locale.trans('input.empty'); }),
          check('uid')
            .custom(async (value: any, { req }: any) => {
              const user = await User.get(mongoose.Types.ObjectId(req.body.uid));
              if (!user) {
                throw new Error(Locale.trans('user.not.exist'));
              }
            }),
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
      }
      default:
        return [
          (req: Request, res: Response, next: NextFunction) => {
            validator.validationHandler(req, res, next);
          },
        ];
    }
  },
};


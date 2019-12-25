import * as path from 'path';
import * as express from 'express';
// @ts-ignore
import multer, { Express } from 'multer';
import { UPLOAD_AVATAR_PATH } from '../core/config';

/** Storage Avatar */
const storageAvatar: multer.StorageEngine = multer.diskStorage({
	destination: UPLOAD_AVATAR_PATH,
	filename(req: Express.Request, file: Express.Multer.File, fn: (error: Error | null, filename: string) => void): void {
		fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
	},
});

export const uploadAvatar: any = multer({
	storage: storageAvatar,
	limits: { fileSize: 2 * 1024 * 1024 },
	fileFilter(req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void): void {
		// console.log('File => ', file);
		// console.log('Req => ', req);
		const extension: boolean = ['.png', '.jpg', '.jpeg'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
		const mimeType: boolean = file.mimetype.indexOf('image') >= 0;

		if (extension && mimeType) {
			return callback(null, true);
		}
		callback(new Error('Invalid file type. Only pictures are allowed !'), false);
	},
}).single('picture');

export const pictureUploadHandler: Function = async (req: express.Request, res: express.Response): Promise<any> => {
	return new Promise((resolve: any, reject: any): void => {
		uploadAvatar(req, res, (error: Error) => {
			if (error) {
				return reject(error);
			}

			return resolve({ file: req.file, body: req.body });
		});
	});
};

/** Storage File */
/*
const storageFile = multer.diskStorage({
  destination: './public/uploads/files',
  filename(req, file, fn) {
    fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

export const uploadFile = multer({
  storage: storageAvatar,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    const extension: boolean = ['.json', '.csv'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
    const mimeType: boolean = file.mimetype.indexOf('image') > 0;
    if (extension && mimeType) {
      return callback(null, true);
    }
    callback(new Error('Invalid file type. Only JSON and CSV file are allowed !'));
  },
}).single('file');*/

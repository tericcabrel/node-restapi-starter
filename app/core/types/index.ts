import { Request } from 'express';

export interface CustomRequest extends Request {
	userId: number;
}

export type TokenInfo = {
	id: string;
};

export type Locales = {
	[string: string]: {
		[string: string]: string,
	},
};

export type ValidatorMethod = {
	[key: string]: {
		[key: string]: string,
	},
};

export type RegexObject = {
	ipAddress: RegExp;
	url: RegExp;
	email: RegExp;
	date: RegExp;
};

export type InternalServerError = {
	message: string;
};

export type UploadedFile = {
	fieldname: string;    // files
	originalname: string; // mergedSchema.zip
	encoding: string;     // 7bit
	mimetype: string;     // application/zip
	destination: string;  // ./public/uploads/files
	filename: string;			// 1571575008566-files.zip
	path: string;					// public/uploads/files/1571575008566-files.zip
	size: number;					// 1255
};

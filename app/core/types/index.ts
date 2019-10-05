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

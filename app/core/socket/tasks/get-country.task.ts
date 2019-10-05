import joi, { ObjectSchema } from '@hapi/joi';

import { SocketSession, SocketSessionItem } from '../../types/socket';

import { SocketTask } from './task';

import { getCountryEvent } from '../events';

class GetCountryTask {
	static schema: ObjectSchema = joi.object({
		code: joi.string().required(),
	}).required();

	static run(socketSessions: SocketSession, socketSessionId: string, data: any): void {
		const sessionItem: SocketSessionItem | undefined = socketSessions[socketSessionId];

		const joiValidation: joi.ValidationResult<joi.Schema> = SocketTask.validateWithDefaultSchema(
			data,
			GetCountryTask.schema,
		);

		if (joiValidation.error) {
			const response: any = { errorType: 'wrong format', error: joiValidation.error };

			sessionItem.socket.emit(getCountryEvent.response, response);
		}

		// TODO Send Request to get country

		if (sessionItem !== undefined) {
			sessionItem.socket.emit(getCountryEvent.response, data);
		}
	}
}

export { GetCountryTask };

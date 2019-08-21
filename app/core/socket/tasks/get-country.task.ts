import Joi from '@hapi/joi';

import { SocketSession, SocketSessionItem } from '../../types/socket';
import { GetCountryEvent } from '../events';
import SocketTask from './task';

export default class GetCountryTask {
	static schema = Joi.object({
		code: Joi.string().required()
	}).required();

	static run(socketSessions: SocketSession, socketSessionId: string, data: any): void {
		const sessionItem: SocketSessionItem | undefined = socketSessions[socketSessionId];

		const joiValidation: Joi.ValidationResult<Joi.Schema> = SocketTask.validateWithDefaultSchema(
			data,
			GetCountryTask.schema
		);

		if (joiValidation.error) {
			const response = { errorType: 'wrong format', error: joiValidation.error };
			sessionItem.socket.emit(GetCountryEvent.response, response);
		}

		// TODO Send Request to get country

		if (sessionItem !== undefined) {
			sessionItem.socket.emit(GetCountryEvent.response, data);
		}
	}
}

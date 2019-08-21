import Joi from '@hapi/joi';

export default class SocketTask {
	//
	static defaultSchema = {
		rid: Joi.string().required()
	};

	 static validateWithDefaultSchema(data: any, joiSchema: Joi.Schema){
		return Joi.validate({ ...SocketTask.defaultSchema, ...data }, joiSchema);
	};

	 static validateWithoutDefaultSchema(data: any, joiSchema: Joi.Schema){
		return Joi.validate(data, joiSchema);
	};
}

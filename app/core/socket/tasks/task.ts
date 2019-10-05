import joi, { SchemaMap, ValidationResult } from '@hapi/joi';

class SocketTask {
	//
	static defaultSchema: SchemaMap = {
		rid: joi.string().required(),
	};

	static validateWithDefaultSchema(data: any, joiSchema: joi.Schema): ValidationResult<joi.Schema> {
		return joi.validate({ ...SocketTask.defaultSchema, ...data }, joiSchema);
	}

	static validateWithoutDefaultSchema(data: any, joiSchema: joi.Schema): ValidationResult<joi.Schema> {
		return joi.validate(data, joiSchema);
	}
}

export { SocketTask };

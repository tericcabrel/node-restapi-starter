import chai from 'chai';
import sinon from 'sinon';

import { createJwtToken } from '../../../core/middleware/auth';
import { localeMiddleware } from '../../../core/middleware/locale';

const expect: Chai.ExpectStatic = chai.expect;

describe('Locale middleware', () => {
	let mockRequest: any;

	class MockResponse {
		private readonly result: any;

		constructor() {
			this.result = {
				status: 200,
				body: {},
			};
		}
		status(code: number): MockResponse {
			this.result.status = code;

			return this;
		}
		json(data: any): any {
			this.result.body = data;

			return this.result;
		}
	}

	const token: string = createJwtToken({ id: '5cee861d04d9f4214dc8dce6' });

	beforeEach(() => {
		mockRequest = {
			headers: {
				'x-access-token': token,
				'accept-language': 'fr',
			},
			originalUrl: '/v1/tasks',
		};
	});

	it('should set locale to french and call next() because',  () => {
		const nextSpy: sinon.SinonSpy = sinon.spy();

		localeMiddleware(mockRequest, new MockResponse() as any, nextSpy);

		expect(nextSpy.calledOnce).to.be.true;
	});
});

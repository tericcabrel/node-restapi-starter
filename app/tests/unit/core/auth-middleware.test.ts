import chai from 'chai';
import sinon from 'sinon';

import { authMiddleware, createJwtToken } from '../../../core/middleware/auth';
import { JWT_EXPIRE, JWT_SECRET } from '../../../core/config';

const expect: Chai.ExpectStatic = chai.expect;

describe('Auth middleware', () => {
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

	const token: string = createJwtToken({ id: '5cee861d04d9f4214dc8dce6' }, JWT_SECRET, JWT_EXPIRE);

	beforeEach(() => {
		mockRequest = {
			headers: {
				'x-access-token': 'token',
			},
			originalUrl: '/v1/tasks',
		};
	});

	it('should return 401 due to insistent originalUrl', async () => {
		const nextSpy: sinon.SinonSpy = sinon.spy();

		delete mockRequest.originalUrl;

		const res: any = await authMiddleware(mockRequest, new MockResponse() as any, nextSpy);

		// console.log(res);

		expect(nextSpy.calledOnce).to.be.false;
		expect(res.status).to.be.eq(401);
	});

	it('should return 401 due to unauthorized route', async () => {
		const nextSpy: sinon.SinonSpy = sinon.spy();

		const res: any = await authMiddleware(mockRequest, new MockResponse() as any, nextSpy);

		expect(nextSpy.calledOnce).to.be.false;
		expect(res.status).to.be.eq(401);
	});

	it('should return 401 due invalid token provided', async () => {
		const nextSpy: sinon.SinonSpy = sinon.spy();

		mockRequest.headers['x-access-token'] = 'bad-token';
		mockRequest.originalUrl = '/v1/tasks/create';

		const res: any = await authMiddleware(mockRequest, new MockResponse() as any, nextSpy);

		expect(nextSpy.calledOnce).to.be.false;
		expect(res.status).to.be.eq(401);
	});

	it('should return 401 due to inconsistent data in the decoded token', async () => {
		const nextSpy: sinon.SinonSpy = sinon.spy();

		mockRequest.headers['x-access-token'] = createJwtToken({ data: '5cee861d04d9f4214dc8dce6' }, JWT_SECRET, JWT_EXPIRE);
		mockRequest.originalUrl = '/v1/tasks/create';

		const res: any = await authMiddleware(mockRequest, new MockResponse() as any, nextSpy);

		expect(nextSpy.calledOnce).to.be.false;
		expect(res.status).to.be.eq(401);
	});

	it('should call next() because it\'s the route is authorized', async () => {
		const nextSpy: sinon.SinonSpy = sinon.spy();

		mockRequest.originalUrl = '/v1/auth/register';

		await authMiddleware(mockRequest, new MockResponse() as any, nextSpy);

		expect(nextSpy.calledOnce).to.be.true;
	});

	it('should call next() because the request has a valid token', async () => {
		const nextSpy: sinon.SinonSpy = sinon.spy();

		mockRequest.headers['x-access-token'] = token;
		mockRequest.originalUrl = '/v1/tasks';

		await authMiddleware(mockRequest, new MockResponse() as any, nextSpy);

		expect(nextSpy.calledOnce).to.be.true;
	});
});

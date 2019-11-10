import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import { Response } from 'superagent';

import { server } from '../../../index';

import mailer from '../../../core/mailer';
import { Model as UserModel } from '../../../models/user.model';
import { createJwtToken, decodeJwtToken } from '../../../core/middleware/auth';
import * as config  from '../../../core/config';

const expect: Chai.ExpectStatic = chai.expect;

chai.use(chaiHttp);

let emailToken: string = '';
let accessToken: string = '';
let refreshToken: string = '';

describe('User endpoints', () => {
	const userData: any = {
		name: 'John DOE',
		username: 'jdoe',
		email: 'john@doe.com',
		password: 'qwerty',
	};
	const baseURL: string = '/v1/auth';

	beforeEach(() => {

	});

	afterEach(() => {
		sinon.restore();
	});

	after(async () => {
		const user: any = await UserModel.findOne({ email: userData.email });

		if (user) {
			await UserModel.delete(user._id);
		}
	});

	describe('Register user endpoint', () => {
		const uri: string = `${baseURL}/register`;

		// POST - Fail to create an user
		it('should fail to create an user', () => {
			return chai.request(server)
				.post(uri)
				.send({})
				.then((res: Response) => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('errors');
				});
		});

		// POST - Create an user
		it('should create an user', () => {
			const spySendMail: sinon.SinonStub = sinon.stub(mailer, 'sendMail');

			return chai.request(server)
				.post(uri)
				.send(userData)
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');

					// console.log(spySendMail.getCall(0).args[0]);
					const array: string[] = spySendMail.getCall(0).args[0].context.url.split('=');

					emailToken = array[array.length - 1];

					expect(emailToken).to.be.a('string');
					expect(emailToken.length).to.greaterThan(0);
				});
		});
	});

	describe('Login user\'s endpoint failure', () => {
		const uri: string = `${baseURL}/login`;

		// POST - Fail to login
		it('should fail to login the user due to invalid data', () => {
			return chai.request(server)
				.post(uri)
				.send({})
				.then((res: Response) => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('errors');
				});
		});

		// POST - Fail to login
		it('should fail to login the user due to non-existent email address', () => {
			return chai.request(server)
				.post(uri)
				.send({ email: 'fake@email.com', password: 'password' })
				.then((res: Response) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Fail to login
		it('should fail to login the user due to invalid password', () => {
			return chai.request(server)
				.post(uri)
				.send({ email: userData.email, password: 'password' })
				.then((res: Response) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Fail to login
		it('should fail to login the user due to unconfirmed account', () => {
			return chai.request(server)
				.post(uri)
				.send({ email: userData.email, password: userData.password })
				.then((res: Response) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});
	});

	describe('Confirm account of the user endpoint', () => {
		const uri: string = `${baseURL}/account/confirm`;

		// POST - Fail to confirm the account
		it('should fail to confirm the account due to invalid data', () => {
			return chai.request(server)
				.post(uri)
				.send({})
				.then((res: Response) => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('errors');
				});
		});

		// POST - Fail to confirm the account
		it('should fail to confirm the account due to bad token', () => {
			return chai.request(server)
				.post(uri)
				.send({ token: 'token' })
				.then((res: Response) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Confirm the account
		it('should confirm the account', () => {
			return chai.request(server)
				.post(uri)
				.send({ token: emailToken })
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});
	});

	describe('Login user\'s endpoint success', () => {
		// POST - Login the user successfully
		it('should login the user successfully', () => {
			return chai.request(server)
				.post(`${baseURL}/login`)
				.send({ email: userData.email, password: userData.password })
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(Object.keys(res.body).length).to.be.eq(3);

					accessToken = res.body.token;
					refreshToken = res.body.refreshToken;
				});
		});
	});

	describe('Forgot password endpoint', () => {
		const uri: string = `${baseURL}/password/forgot`;

		// POST - Fail to send reset email link
		it('should fail to send reset email link due to invalid data', () => {
			return chai.request(server)
				.post(uri)
				.send({})
				.then((res: Response) => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('errors');
				});
		});

		// POST - Fail to send reset email link
		it('should fail to send reset email link due to non-existent email address', () => {
			return chai.request(server)
				.post(uri)
				.send({ email: 'fake@email.com' })
				.then((res: Response) => {
					expect(res).to.have.status(404);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Send reset email link successfully
		it('should send reset email link', () => {
			const spySendMail: sinon.SinonStub = sinon.stub(mailer, 'sendMail');

			return chai.request(server)
				.post(uri)
				.send({ email: userData.email })
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');

					// console.log(spySendMail.getCall(0).args[0]);
					const array: string[] = spySendMail.getCall(0).args[0].context.url.split('=');

					emailToken = array[array.length - 1];

					expect(emailToken).to.be.a('string');
					expect(emailToken.length).to.greaterThan(0);
				});
		});
	});

	describe('Reset password endpoint', () => {
		const uri: string = `${baseURL}/password/reset`;
		const password: string = 'azerty';

		// POST - Fail to send reset the password
		it('should fail to reset the password due to invalid data', () => {
			return chai.request(server)
				.post(uri)
				.send({})
				.then((res: Response) => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('errors');
				});
		});

		// POST - Fail to reset the password
		it('should fail to reset the password due to bad token', () => {
			return chai.request(server)
				.post(uri)
				.send({ password, reset_token: 'token' })
				.then((res: Response) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Fail to reset the password
		it('should fail to reset the password due to non-existent user', () => {
			return chai.request(server)
				.post(uri)
				.send({
					password,
					reset_token: createJwtToken(
						{ id: '5cee861d04d9f4214dc8dce6' }, config.JWT_EMAIL_SECRET, config.JWT_EMAIL_EXPIRE,
					)})
				.then((res: Response) => {
					expect(res).to.have.status(404);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Reset the password successfully
		it('should reset the password', () => {
			return chai.request(server)
				.post(uri)
				.send({ password, reset_token: emailToken })
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Login the user successfully
		it('should login the user successfully', () => {
			return chai.request(server)
				.post(`${baseURL}/login`)
				.send({ password, email: userData.email })
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(Object.keys(res.body).length).to.be.eq(3);

					accessToken = res.body.token;
					refreshToken = res.body.refreshToken;
				});
		});
	});

	describe('Refresh token endpoint',  () => {
		const uri: string = `${baseURL}/token/refresh`;

		// POST - Fail to refresh the token
		it('should fail to refresh the token due to invalid data', () => {
			return chai.request(server)
				.post(uri)
				.send({})
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('errors');
				});
		});

		// POST - Fail to reset the password
		it('should fail to refresh the token due to bad token', async () => {
			const decoded: any = await decodeJwtToken(accessToken, config.JWT_SECRET);

			return chai.request(server)
				.post(uri)
				.send({ uid: decoded.id, token: accessToken })
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		// POST - Refresh the token successfully
		it('should refresh the token', async () => {
			const decoded: any = await decodeJwtToken(accessToken, config.JWT_SECRET);

			return chai.request(server)
				.post(uri)
				.send({ uid: decoded.id, token: refreshToken })
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');

					accessToken = res.body.token;
				});
		});

		// POST - Get all tasks
		it('should get all tasks', () => {
			return chai.request(server)
				.get('/v1/tasks')
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('array');
				});
		});
	});
});

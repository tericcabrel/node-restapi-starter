import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import { Response } from 'superagent';

import { server } from '../../../index';

import mailer from '../../../core/mailer';
import { Model as UserModel } from '../../../models/user.model';

const expect: Chai.ExpectStatic = chai.expect;

chai.use(chaiHttp);

let emailToken: string = '';
let accessToken: string = '';
let refreshToken: string = '';

describe.only('Auth endpoints', () => {
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

});

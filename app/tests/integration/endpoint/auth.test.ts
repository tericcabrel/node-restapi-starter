import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import { Response } from 'superagent';

import { server } from '../../../index';

import mailer from '../../../core/mailer';

const expect: Chai.ExpectStatic = chai.expect;

chai.use(chaiHttp);

let emailToken: string = '';

describe.only('Auth endpoints', () => {
	const userData: any = {
		name: 'John DOE',
		username: 'jdoe',
		email: 'john@doe.com',
		password: 'qwerty',
	};

	beforeEach(() => {

	});

	afterEach(() => {

	});

	// POST - Fail to create an user
	it('should fail to create an user', () => {
		return chai.request(server)
			.post('/v1/auth/register')
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
			.post('/v1/auth/register')
			.send(userData)
			.then((res: Response) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');

				// console.log(spySendMail.getCall(0).args[0]);
				const array: string[] = spySendMail.getCall(0).args[0].context.url.split('=');

				emailToken = array[array.length - 1];
				console.log('Email token => ', emailToken);

				expect(emailToken).to.be.a('string');
				expect(emailToken.length).to.greaterThan(0);
			});
	});
});

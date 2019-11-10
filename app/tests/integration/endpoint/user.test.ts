import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Response } from 'superagent';

import { server } from '../../../index';
import { Model as UserModel } from '../../../models/user.model';
import { TokenInfo } from '../../../core/types';
import * as config  from '../../../core/config';

const expect: Chai.ExpectStatic = chai.expect;

chai.use(chaiHttp);

let userId: string = '';
let accessToken: string = '';
let accessTokenWithBadUser: string = '';
const fakeUserId: string = '5cee861d04d9f4214dc8dce6';

describe.only('User endpoints', () => {
	const userData: any = {
		name: 'Jane DOE',
		username: 'janed',
		email: 'jane@doe.com',
		password: 'qwerty',
	};
	const baseURL: string = '/v1/users';

	before(async () => {
		const hashedPassword: string = bcrypt.hashSync(userData.password, 10);

		const userParam: any = { ...userData, password: hashedPassword, email_token: null, confirmed: true };
		const user: any  = new UserModel(userParam);

		await user.save();

		// console.log(user);
		userId = user._id;

		const tokenInfo: TokenInfo = { id: userId };

		accessToken = jwt.sign(tokenInfo, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });
		accessTokenWithBadUser = jwt.sign(
			{ id: fakeUserId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE },
		);
	});

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

	it('Should get all the users', () => {
		return chai.request(server)
			.get(baseURL)
			.set('x-access-token', accessToken)
			.then((res: Response) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('array');
				expect(res.body.map((u: any) => u.email).includes(userData.email)).to.eq(true);
			});
	});

	describe('Get user info by the access token', () => {
		const uri: string = `${baseURL}/me`;

		it('Should not found the user', () => {
			return chai.request(server)
				.get(uri)
				.set('x-access-token', accessTokenWithBadUser)
				.then((res: Response) => {
					expect(res).to.have.status(404);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		it('Should found the user', () => {
			return chai.request(server)
				.get(uri)
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body.email).to.eq(userData.email);
				});
		});
	});

	describe('Get user info by ID', () => {
		it('Should not found the user', () => {
			return chai.request(server)
				.get(`${baseURL}/${fakeUserId}`)
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(404);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		it('Should found the user', () => {
			return chai.request(server)
				.get(`${baseURL}/${userId}`)
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body.email).to.eq(userData.email);
				});
		});
	});

	describe('Update user password', () => {
		const uri: string = `${baseURL}/password`;
		const newPassword: string =  'azerty';

		it('should fail to update user password due to invalid data', () => {
			return chai.request(server)
				.put(uri)
				.send({})
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('errors');
				});
		});

		it('should fail to update user password due to bad resource owner', () => {
			return chai.request(server)
				.put(uri)
				.send({ uid: userId, password: userData.password, new_password: newPassword })
				.set('x-access-token', accessTokenWithBadUser)
				.then((res: Response) => {
					expect(res).to.have.status(403);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		it('should fail to update user password due to non existent user', () => {
			return chai.request(server)
				.put(uri)
				.send({ uid: fakeUserId, password: userData.password, new_password: newPassword })
				.set('x-access-token', accessTokenWithBadUser)
				.then((res: Response) => {
					expect(res).to.have.status(404);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		it('should fail to update user password due to invalid current password', () => {
			return chai.request(server)
				.put(uri)
				.send({ uid: userId, password: 'bad-password', new_password: newPassword })
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		it('should update user password successfully', () => {
			return chai.request(server)
				.put(uri)
				.send({ uid: userId, password: userData.password, new_password: newPassword })
				.set('x-access-token', accessToken)
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
				});
		});

		it('should login the user successfully', () => {
			return chai.request(server)
				.post('/v1/auth/login')
				.send({ password: newPassword, email: userData.email })
				.then((res: Response) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(Object.keys(res.body).length).to.be.eq(3);

					accessToken = res.body.token;
				});
		});
	});
});

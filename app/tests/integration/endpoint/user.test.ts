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
			{ id: '5cee861d04d9f4214dc8dce6' }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE },
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
});
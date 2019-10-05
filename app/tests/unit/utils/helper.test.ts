import chai from 'chai';

import * as config from '../../../core/config';
import { Locale } from '../../../core/locale';

import * as helpers from '../../../utils/helpers';

import ExpectStatic = Chai.ExpectStatic;
import { InternalServerError } from '../../../core/types';

const expect: ExpectStatic = chai.expect;

Locale.init();

describe('Test Helpers methods', () => {
	it('should generate a number between 1 and 100', () => {
		expect(helpers.getRandomInt(1, 100)).to.be.within(1, 100);
	});

	it('should generate a string with length of 12', () => {
		expect(helpers.randomStr(12)).to.have.lengthOf(12);
	});

	it('should be a valid IP address', () => {
		expect(helpers.isValidIPV4Address('10.12.9.231')).to.equal(true);
	});

	it('should remove space around the string', () => {
		expect(helpers.cleanText('  coding ')).to.have.lengthOf(6);
	});

	it('should paginate data', () => {
		const data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		expect(helpers.paginate(data, 4, 1)).to.be.an('array');
		expect(helpers.paginate(data, 4, 1)).to.have.lengthOf(4);
		expect(helpers.paginate(data, 4, 1)).to.have.all.keys([0, 1, 2, 3]);
		expect(helpers.paginate(data, 4, 2)).to.have.members([5, 6, 7, 8]);
		expect(helpers.paginate(data, 4, 3)).to.have.length(2);
	});

	it('should return Internal server error !', () => {
		const result: InternalServerError = helpers.internalError();

		expect(result).to.have.property('message');
		expect(result.message).to.be.include('error');
	});

	it('should return The model User already exist', () => {
		expect(helpers.existMessage('User')).to.be.include('User');
	});

	it('should return The model User not found', () => {
		expect(helpers.notFound('User')).to.be.include('not found');
	});

	describe('Get base URL request', () => {
		const request: any = {
			hostname: 'localhost',
			protocol: 'http',
		};

		it('should return local base URL', () => {
			expect(helpers.getBaseUrlFromRequest(request)).to.equal(`http://localhost:${config.SERVER_PORT}`);
		});

		it('should return global base URL', () => {
			request.hostname = 'api.example.com';
			request.protocol = 'https';

			expect(helpers.getBaseUrlFromRequest(request)).to.equal('https://api.example.com');
		});
	});
});

import chai from 'chai';
import { RedisClient } from 'redis';

import { RedisManager } from '../../../core/storage/redis-manager';

const expect: Chai.ExpectStatic = chai.expect;

describe('Redis Manager', () => {
	const key: string = 'app_key_token';
	const keyExpire: string = 'app_key_expire_token';
	const value: string = 'token';

	it('should return an instance of Redis ', () => {
		const client: RedisClient = RedisManager.getInstance();

		expect(client).to.be.not.null;
	});

	describe('SET', () => {
		it('should set a value in redis', async () => {
			const result: boolean = await RedisManager.set(key, value);

			expect(result).to.eq(true);
		});

		it('should set a value with expiration time redis', async () => {
			const result: boolean = await RedisManager.set(keyExpire, value, 900);

			expect(result).to.eq(true);
		});
	});

	describe('GET', () => {
		it('should get a not null value', async () => {
			const result: string|null = await RedisManager.get(key);

			expect(result).to.be.not.null;
			expect(result).to.eq(value);
		});

		it('should get a null value', async () => {
			const result: string|null = await RedisManager.get('unknown_key');

			expect(result).to.be.null;
		});
	});

	describe('GET KEYS', () => {
		it('should return keys that match the pattern provided', async () => {
			const result: string[] = await RedisManager.keys('app_*');

			expect(result).to.be.an('array');
			expect(result).to.have.length(2);
			expect(result[0]).to.be.eq(key);
		});

		it('should return an empty array of key', async () => {
			const result: string[] = await RedisManager.keys('unknown_key');

			expect(result).to.be.an('array');
			expect(result).to.have.length(0);
		});
	});

	describe('GET VALUES', () => {
		it('should return values of array of key provided', async () => {
			const result: string[] = await RedisManager.getValues([key, keyExpire]);

			expect(result).to.be.an('array');
			expect(result).to.have.length(2);
			expect(result[0]).to.be.eq(value);
			expect(result[1]).to.be.eq(value);
		});

		it('should return an empty array of value', async () => {
			const result: string[] = await RedisManager.getValues(['unknown_key', 'no_exist_key']);

			expect(result).to.be.an('array');
			expect(result).to.have.length(2);
			expect(result[0]).to.be.eq(null);
			expect(result[1]).to.be.eq(null);
		});
	});

	describe('DELETE', () => {
		it('should delete a key with his value', async () => {
			const result: boolean = await RedisManager.delete(key);

			expect(result).to.be.eq(true);

			const exist: string|null = await RedisManager.get(key);

			expect(exist).to.be.null;
		});

		it('should delete a key who not exist', async () => {
			const result: boolean = await RedisManager.delete('unknown_key');

			expect(result).to.be.eq(true);
		});
	});
});

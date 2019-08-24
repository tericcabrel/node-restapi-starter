import redis, { RedisClient } from 'redis';

/**
 * This class is responsible for read and write in Redis
 * @class
 *
 * @property {RedisClient} client - Redis client connection instance
 */
class RedisManager {
  /**
   * @private
   * @static
   * */
  private static client: RedisClient;

  /**
   * Create a connection instance to redis an returns it
   * @public
   * @static
   *
   * @return RedisClient
   */
  public static getInstance(): RedisClient {
    if (!this.client) {
      this.client = redis.createClient();
    }

    return this.client;
  }

  /**
   * Get a value in Redis
   * @public
   * @async
   * @static
   *
   * @param {string} key
   *
   * @return Promise<string|null>
   */
  public static getValue(key: string): Promise<string|null> {
    return new Promise((resolve, fail) => {
      RedisManager.getInstance().get(key, (error, result) => {
        if (error) resolve(null);
        resolve(result);
      });
    });
  }

  /**
   * Set a value in Redis
   * @public
   * @async
   * @static
   *
   * @param {string} key
   * @param {string} value
   *
   * @return Promise<string|null>
   */
  public static setValue(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, fail) => {
      RedisManager.getInstance().set(key, value, (error, result) => {
        if (error) throw error;
        resolve(true);
      });
    });
  }
}

export default RedisManager;

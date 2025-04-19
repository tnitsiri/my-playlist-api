import Redis from 'ioredis';
import Keyv from 'keyv';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

/**
 * ANCHOR Cache Service
 * @date 05/04/2025 - 04:45:25
 *
 * @export
 * @class CacheService
 * @typedef {CacheService}
 */
@Injectable()
export class CacheService {
  private readonly redis: Redis;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  /**
   * ANCHOR Manager
   * @date 05/04/2025 - 04:47:36
   *
   * @readonly
   * @type {Cache}
   */
  get manager(): Cache {
    return this.cacheManager;
  }

  /**
   * ANCHOR Key
   * @date 05/04/2025 - 04:46:28
   *
   * @param {...string[]} paths
   * @returns {string}
   */
  key(...paths: string[]): string {
    const path: string = paths.join(':').replace(/:+/g, ':');

    return path;
  }

  /**
   * ANCHOR Prefix
   * @date 05/04/2025 - 04:46:34
   *
   * @param {...string[]} paths
   * @returns {string}
   */
  prefix(...paths: string[]): string {
    const key: string = this.key(...paths);
    const prefix: string = `${key}:*`.replace(/:+/g, ':');

    return prefix;
  }

  /**
   * ANCHOR Delete Prefix
   * @date 08/04/2025 - 04:32:26
   *
   * @async
   * @param {string} prefix
   * @returns {Promise<void>}
   */
  async deletePrefix(prefix: string): Promise<void> {
    // keys
    const keys: string[] = await this.redis.keys(prefix);

    if (keys.length < 1) {
      return;
    }

    // store
    if (this.cacheManager.stores.length < 1) {
      return;
    }

    // store
    const store: Keyv = this.cacheManager.stores[0];

    // delete many
    store.deleteMany(keys);
  }
}

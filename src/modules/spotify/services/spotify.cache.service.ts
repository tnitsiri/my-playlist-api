import { Injectable } from '@nestjs/common';
import {
  SpotifyAccessTokenCache,
  SpotifyPrefixCache,
} from 'src/caches/spotify.cache';
import { CacheService } from 'src/services/cache/cache.service';

/**
 * ANCHOR Spotify Cache Service
 * @date 19/04/2025 - 16:36:58
 *
 * @export
 * @class SpotifyCacheService
 * @typedef {SpotifyCacheService}
 */
@Injectable()
export class SpotifyCacheService {
  constructor(private readonly cacheService: CacheService) {}

  /**
   * ANCHOR Access Token Cache Key
   * @date 19/04/2025 - 16:39:34
   *
   * @returns {string}
   */
  accessTokenCacheKey(): string {
    return this.cacheService.key(SpotifyPrefixCache, SpotifyAccessTokenCache);
  }
}

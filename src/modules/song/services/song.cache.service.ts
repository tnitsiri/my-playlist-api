import { Injectable } from '@nestjs/common';
import {
  SongPrefixCache,
  SongSearchResultSuffixCache,
} from 'src/caches/song.cache';
import { CacheService } from 'src/services/cache/cache.service';

/**
 * ANCHOR Song Cache Service
 * @date 22/04/2025 - 01:48:50
 *
 * @export
 * @class SongCacheService
 * @typedef {SongCacheService}
 */
@Injectable()
export class SongCacheService {
  constructor(private readonly cacheService: CacheService) {}

  /**
   * ANCHOR Search Result Cache Key
   * @date 22/04/2025 - 01:51:05
   *
   * @param {{ songId: string }} payload
   * @returns {string}
   */
  searchResultCacheKey(payload: { songId: string }): string {
    return this.cacheService.key(
      SongPrefixCache,
      payload.songId,
      SongSearchResultSuffixCache,
    );
  }
}

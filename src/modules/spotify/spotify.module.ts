import { Module } from '@nestjs/common';
import { SpotifyService } from './services/spotify.service';
import { SpotifyCacheService } from './services/spotify.cache.service';

/**
 * ANCHOR Spotify Module
 * @date 19/04/2025 - 16:22:10
 *
 * @export
 * @class SpotifyModule
 * @typedef {SpotifyModule}
 */
@Module({
  providers: [SpotifyService, SpotifyCacheService],
})
export class SpotifyModule {}

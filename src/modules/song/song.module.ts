import { Module } from '@nestjs/common';
import { SongService } from './services/song.service';
import { SongController } from './song.controller';
import { SpotifyService } from '../spotify/services/spotify.service';
import { SpotifyCacheService } from '../spotify/services/spotify.cache.service';

/**
 * ANCHOR Song Module
 * @date 19/04/2025 - 11:41:00
 *
 * @export
 * @class SongModule
 * @typedef {SongModule}
 */
@Module({
  controllers: [SongController],
  providers: [SongService, SpotifyService, SpotifyCacheService],
})
export class SongModule {}

import { Module } from '@nestjs/common';
import { SongService } from './services/song.service';

/**
 * ANCHOR Song Module
 * @date 19/04/2025 - 11:41:00
 *
 * @export
 * @class SongModule
 * @typedef {SongModule}
 */
@Module({
  providers: [SongService],
})
export class SongModule {}

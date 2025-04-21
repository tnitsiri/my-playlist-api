import { Module } from '@nestjs/common';
import { SongService } from './services/song.service';
import { SongController } from './song.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Audio, AudioSchema } from 'src/schemas/audio.schema';
import { PlaylistService } from '../playlist/services/playlist.service';
import { Playlist, PlaylistSchema } from 'src/schemas/playlist.schema';
import { SongCacheService } from './services/song.cache.service';

/**
 * ANCHOR Song Module
 * @date 19/04/2025 - 11:41:00
 *
 * @export
 * @class SongModule
 * @typedef {SongModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Audio.name,
        schema: AudioSchema,
      },
      {
        name: Playlist.name,
        schema: PlaylistSchema,
      },
    ]),
  ],
  controllers: [SongController],
  providers: [SongService, PlaylistService, SongCacheService],
})
export class SongModule {}

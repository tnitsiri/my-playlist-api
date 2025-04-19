import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from 'src/schemas/playlist.schema';

/**
 * ANCHOR Playlist Module
 * @date 18/04/2025 - 10:57:49
 *
 * @export
 * @class PlaylistModule
 * @typedef {PlaylistModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Playlist.name,
        schema: PlaylistSchema,
      },
    ]),
  ],
  controllers: [PlaylistController],
})
export class PlaylistModule {}

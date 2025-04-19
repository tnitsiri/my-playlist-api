import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Song, SongSchema } from './song.schema';

/**
 * ANCHOR Playlist
 * @date 18/04/2025 - 10:47:16
 *
 * @export
 * @class Playlist
 * @typedef {Playlist}
 */
@Schema({
  autoCreate: true,
  autoIndex: true,
  timestamps: true,
})
export class Playlist {
  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  })
  title: string;

  @Prop({
    type: [SongSchema],
    required: true,
  })
  songs: Song[];

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;
}

/**
 * ANCHOR Playlist Document
 * @date 18/04/2025 - 10:47:27
 *
 * @export
 * @typedef {PlaylistDocument}
 */
export type PlaylistDocument = HydratedDocument<Playlist>;

/**
 * ANCHOR Playlist Schema
 * @date 18/04/2025 - 10:47:35
 *
 * @type {*}
 */
export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

PlaylistSchema.index({
  title: 1,
});

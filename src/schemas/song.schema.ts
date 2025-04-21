import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * ANCHOR Song
 * @date 18/04/2025 - 10:53:46
 *
 * @export
 * @class Song
 * @typedef {Song}
 */
@Schema({
  _id: false,
  autoCreate: false,
  autoIndex: false,
  timestamps: false,
})
export class Song {
  @Prop({
    type: String,
    required: true,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  songId: string;

  @Prop({
    type: String,
    required: true,
  })
  songTitle: string;

  @Prop({
    type: String,
    required: true,
  })
  albumId: string;

  @Prop({
    type: String,
    required: true,
  })
  albumName: string;

  @Prop({
    type: [String],
    required: true,
  })
  artistsName: string[];

  @Prop({
    type: String,
  })
  thumbnail?: string | null;

  @Prop({
    type: String,
    required: true,
  })
  durationText: string;

  @Prop({
    type: Number,
    required: true,
  })
  durationSeconds: number;

  @Prop({
    type: String,
    required: true,
  })
  filePathname: string;

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
 * ANCHOR Song Document
 * @date 18/04/2025 - 10:54:03
 *
 * @export
 * @typedef {SongDocument}
 */
export type SongDocument = HydratedDocument<Song>;

/**
 * ANCHOR Song Schema
 * @date 18/04/2025 - 10:54:10
 *
 * @type {*}
 */
export const SongSchema = SchemaFactory.createForClass(Song);

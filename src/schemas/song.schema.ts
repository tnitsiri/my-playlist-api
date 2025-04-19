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

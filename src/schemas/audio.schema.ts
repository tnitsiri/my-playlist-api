import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * ANCHOR Audio
 * @date 21/04/2025 - 18:46:26
 *
 * @export
 * @class Audio
 * @typedef {Audio}
 */
@Schema({
  autoCreate: true,
  autoIndex: true,
  timestamps: true,
})
export class Audio {
  @Prop({
    type: String,
    required: true,
  })
  songId: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
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
    trim: true,
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
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;
}

/**
 * ANCHOR Audio Document
 * @date 21/04/2025 - 18:46:32
 *
 * @export
 * @typedef {AudioDocument}
 */
export type AudioDocument = HydratedDocument<Audio>;

/**
 * ANCHOR Audio Schema
 * @date 21/04/2025 - 18:46:40
 *
 * @type {*}
 */
export const AudioSchema = SchemaFactory.createForClass(Audio);

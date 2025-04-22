import { Injectable } from '@nestjs/common';
import { SongModel } from 'src/models/song.model';
import { Song } from 'src/schemas/song.schema';
import { InjectS3, S3 } from 'nestjs-s3';

/**
 * ANCHOR Song Service
 * @date 19/04/2025 - 11:01:28
 *
 * @export
 * @class SongService
 * @typedef {SongService}
 */
@Injectable()
export class SongService {
  constructor(
    @InjectS3()
    private readonly s3: S3,
  ) {}

  /**
   * ANCHOR Model
   * @date 19/04/2025 - 11:24:10
   *
   * @param {{ song: Song }} payload
   * @returns {SongModel}
   */
  model(payload: { song: Song }): SongModel {
    // song
    const song: Song = payload.song;

    // model
    const model: SongModel = {
      id: song.id,
      songId: song.songId,
      songTitle: song.songTitle,
      albumId: song.albumId,
      albumName: song.albumName,
      artistsName: song.artistsName,
      thumbnail: song.thumbnail,
      durationText: song.durationText,
      durationSeconds: song.durationSeconds,
      pathname: song.pathname,
      url: song.url,
    };

    return model;
  }

  /**
   * ANCHOR Upload
   * @date 22/04/2025 - 13:14:19
   *
   * @async
   * @param {{ file: Buffer; pathname: string }} payload
   * @returns {Promise<string>}
   */
  async upload(payload: { file: Buffer; pathname: string }): Promise<string> {
    // key
    const key: string = `${process.env.DIGITALOCEAN_SPACES_NAMESPACE}/${payload.pathname}`;

    // upload
    await this.s3.putObject({
      Bucket: process.env.DIGITALOCEAN_SPACES_BUCKET,
      Key: key,
      Body: payload.file,
      ACL: 'public-read',
    });

    // url
    const url: string = `https://${process.env.DIGITALOCEAN_SPACES_BUCKET}.${process.env.DIGITALOCEAN_SPACES_REGION}.cdn.digitaloceanspaces.com/${key}`;

    return url;
  }
}

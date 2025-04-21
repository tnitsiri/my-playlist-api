import { Injectable } from '@nestjs/common';
import { SongModel } from 'src/models/song.model';
import { Song } from 'src/schemas/song.schema';

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
      filePathname: song.filePathname,
      fileUrl: '',
    };

    return model;
  }
}

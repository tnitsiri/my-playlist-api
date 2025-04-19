import { Injectable } from '@nestjs/common';
import { PlaylistModel } from 'src/models/playlist.model';
import { SongModel } from 'src/models/song.model';
import { SongService } from 'src/modules/song/services/song.service';
import { PlaylistDocument } from 'src/schemas/playlist.schema';

/**
 * ANCHOR Playlist Service
 * @date 19/04/2025 - 11:02:56
 *
 * @export
 * @class PlaylistService
 * @typedef {PlaylistService}
 */
@Injectable()
export class PlaylistService {
  constructor(private readonly songService: SongService) {}

  /**
   * ANCHOR Model
   * @date 19/04/2025 - 11:01:25
   *
   * @param {{ playlist: PlaylistDocument }} payload
   * @returns {PlaylistModel}
   */
  model(payload: { playlist: PlaylistDocument }): PlaylistModel {
    // playlist
    const playlist: PlaylistDocument = payload.playlist;

    // id
    const id: string = playlist._id.toString();

    // songs
    const songs: SongModel[] = [];

    for (const item of playlist.songs) {
      // song
      const song: SongModel = this.songService.model({
        song: item,
      });

      songs.push(song);
    }

    // model
    const model: PlaylistModel = {
      id,
      title: playlist.title,
      songs,
    };

    return model;
  }
}

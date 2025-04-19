import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  HydratedDocument,
  Model,
  PopulateOptions,
  QueryWithHelpers,
} from 'mongoose';
import { PlaylistModel } from 'src/models/playlist.model';
import { SongModel } from 'src/models/song.model';
import { SongService } from 'src/modules/song/services/song.service';
import { Playlist, PlaylistDocument } from 'src/schemas/playlist.schema';

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
  constructor(
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    private readonly songService: SongService,
  ) {}

  /**
   * ANCHOR Playlist
   * @date 19/04/2025 - 12:17:04
   *
   * @async
   * @param {{
   *     playlistId: string;
   *     session?: ClientSession;
   *     populate?: string[] | PopulateOptions | Array<PopulateOptions>;
   *   }} payload
   * @returns {Promise<PlaylistDocument | null>}
   */
  async playlist(payload: {
    playlistId: string;
    session?: ClientSession;
    populate?: string[] | PopulateOptions | Array<PopulateOptions>;
  }): Promise<PlaylistDocument | null> {
    // playlist
    const playlistQuery: QueryWithHelpers<
      HydratedDocument<PlaylistDocument> | null,
      HydratedDocument<PlaylistDocument>
    > = this.playlistModel
      .findById(payload.playlistId, null, {
        session: payload.session,
      })
      .populate(payload.populate || []);

    const playlist: PlaylistDocument | null = await playlistQuery.exec();

    return playlist || null;
  }

  /**
   * ANCHOR Info
   * @date 19/04/2025 - 12:22:43
   *
   * @async
   * @param {{
   *     playlistId: string;
   *     playlist?: PlaylistDocument;
   *   }} payload
   * @returns {Promise<PlaylistModel | null>}
   */
  async info(payload: {
    playlistId: string;
    playlist?: PlaylistDocument;
  }): Promise<PlaylistModel | null> {
    // info
    let info: PlaylistModel | null = null;

    // playlist data
    if (payload.playlist) {
      info = this.model({
        playlist: payload.playlist,
      });
    }
    // fetch playlist
    else {
      const playlist: PlaylistDocument | null = await this.playlist({
        playlistId: payload.playlistId,
      });

      if (playlist) {
        info = this.model({
          playlist,
        });
      }
    }

    return info;
  }

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

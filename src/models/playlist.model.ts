import { SongModel } from './song.model';

/**
 * ANCHOR Playlist Model
 * @date 19/04/2025 - 10:57:01
 *
 * @export
 * @interface PlaylistModel
 * @typedef {PlaylistModel}
 */
export interface PlaylistModel {
  id: string;
  title: string;
  songs: SongModel[];
}

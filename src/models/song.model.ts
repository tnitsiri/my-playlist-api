/**
 * ANCHOR Song Model
 * @date 19/04/2025 - 10:57:28
 *
 * @export
 * @interface SongModel
 * @typedef {SongModel}
 */
export interface SongModel {
  id: string;
  songId: string;
  songTitle: string;
  albumId: string;
  albumName: string;
  artistsName: string[];
  thumbnail?: string | null;
  durationText: string;
  durationSeconds: number;
  pathname: string;
  url: string;
}

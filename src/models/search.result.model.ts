/**
 * ANCHOR Search Result Model
 * @date 21/04/2025 - 19:07:25
 *
 * @export
 * @interface SearchResultModel
 * @typedef {SearchResultModel}
 */
export interface SearchResultModel {
  id: string;
  songId: string;
  songTitle: string;
  albumId: string;
  albumName: string;
  artistsName: string[];
  thumbnail?: string | null;
  durationText: string;
  durationSeconds: number;
}

/**
 * ANCHOR Spotify Song Model
 * @date 19/04/2025 - 16:24:02
 *
 * @export
 * @interface SpotifySongModel
 * @typedef {SpotifySongModel}
 */
export interface SpotifySongModel {
  id: string;
  songId: string;
  name: string;
  artist: string;
  image?: string | null;
  previewUrl?: string | null;
  externalUrl?: string | null;
}

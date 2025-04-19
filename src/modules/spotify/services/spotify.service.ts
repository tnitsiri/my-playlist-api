/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import escapeRegExp from 'escape-regexp';
import axios, { AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { SpotifySongModel } from 'src/models/spotify.song.model';
import { CacheService } from 'src/services/cache/cache.service';
import { SpotifyCacheService } from './spotify.cache.service';
import { stringify } from 'querystring';
import { v1 as uuidv1 } from 'uuid';

/**
 * ANCHOR Spotify Service
 * @date 19/04/2025 - 16:22:16
 *
 * @export
 * @class SpotifyService
 * @typedef {SpotifyService}
 */
@Injectable()
export class SpotifyService {
  private readonly logger: Logger = new Logger(SpotifyService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly spotifyCacheService: SpotifyCacheService,
  ) {}

  /**
   * ANCHOR Search
   * @date 19/04/2025 - 17:18:35
   *
   * @async
   * @param {string} term
   * @param {boolean} [ignoreRefetch=false]
   * @returns {Promise<SpotifySongModel[]>}
   */
  async search(
    term: string,
    ignoreRefetch = false,
  ): Promise<SpotifySongModel[]> {
    // songs
    const songs: SpotifySongModel[] = [];

    try {
      // access token
      const accessToken: string | null = await this.accessToken();

      if (!accessToken) {
        throw new Error();
      }

      // term
      const q: string = escapeRegExp(term.trim());

      // search
      const { data }: { data: { tracks: { items: any[] } } } = await axios.get(
        'https://api.spotify.com/v1/search',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: q,
            type: 'track',
            market: 'TH',
            limit: '15',
          },
        },
      );

      for (const item of data.tracks.items) {
        // song
        const song: SpotifySongModel | null = this.model(item);

        if (song) {
          songs.push(song);
        }
      }
    } catch (e) {
      if (
        e instanceof AxiosError &&
        e.response &&
        e.response.data &&
        e.response.status &&
        e.response.status == 401
      ) {
        if (!ignoreRefetch) {
          // access token cache key
          const accessTokenCacheKey: string =
            this.spotifyCacheService.accessTokenCacheKey();

          // remove access token cache
          await this.cacheService.manager.del(accessTokenCacheKey);

          // search
          return this.search(term, true);
        }
      }

      throw e;
    }

    return songs;
  }

  /**
   * ANCHOR Access Token
   * @date 19/04/2025 - 16:43:12
   *
   * @async
   * @returns {Promise<string | null>}
   */
  async accessToken(): Promise<string | null> {
    // cache key
    const cacheKey: string = this.spotifyCacheService.accessTokenCacheKey();

    // access token
    let accessToken: string | null =
      await this.cacheService.manager.get<string>(cacheKey);

    if (!accessToken) {
      try {
        // payload
        const payload: string = stringify({
          grant_type: 'client_credentials',
        });

        // token
        const token: string = Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString('base64');

        // info
        const { data }: { data: { access_token: string } } = await axios.post(
          'https://accounts.spotify.com/api/token',
          payload,
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          },
        );

        // access token
        accessToken = data.access_token;

        // store
        await this.cacheService.manager.set(
          cacheKey,
          accessToken,
          1000 * 60 * 60, // 1 hour
        );
      } catch (e) {
        this.logger.error(e);
      }
    }

    return accessToken;
  }

  /**
   * ANCHOR Model
   * @date 19/04/2025 - 17:39:57
   *
   * @param {*} item
   * @returns {(SpotifySongModel | null)}
   */
  model(item: any): SpotifySongModel | null {
    let song: SpotifySongModel | null = null;

    console.log(item);

    if (
      typeof item['id'] == 'string' &&
      typeof item['name'] == 'string' &&
      typeof item['artists'] == 'object' &&
      Array.isArray(item['artists']) &&
      typeof item['album'] == 'object'
    ) {
      // artist
      const artists: string[] = [];

      for (const artistItem of item['artists']) {
        if (typeof artistItem['name'] == 'string') {
          artists.push(artistItem['name']);
        }
      }

      const artist: string = artists.join(' x ');

      // image
      let image: string | null = null;

      // if (
      //   typeof item['album']['images'] == 'object' &&
      //   Array.isArray(item['album']['images'])
      // ) {
      //   const imageItem: object = item['album']['images'].find((e) => {
      //     return (
      //       typeof e['url'] == 'string' &&
      //       typeof e['width'] == 'number' &&
      //       typeof e['height'] == 'number' &&
      //       e['width'] == 300 &&
      //       e['height'] == 300
      //     );
      //   });

      //   if (imageItem != null) {
      //     image = imageItem['url'];
      //   } else if (
      //     item['album']['images'].length > 0 &&
      //     typeof item['album']['images'][0]['url'] == 'string'
      //   ) {
      //     image = item['album']['images'][0]['url'];
      //   }
      // }

      // preview url
      let previewUrl: string | null = null;

      if (typeof item['preview_url'] == 'string') {
        previewUrl = item['preview_url'];
      }

      // external url
      let externalUrl: string | null = null;

      if (
        typeof item['external_urls'] == 'object' &&
        typeof item['external_urls']['spotify'] == 'string'
      ) {
        externalUrl = item['external_urls']['spotify'];
      }

      // song
      song = {
        id: uuidv1(),
        songId: item['id'],
        name: item['name'],
        artist,
        image,
        previewUrl,
        externalUrl,
      };
    }

    return song;
  }
}

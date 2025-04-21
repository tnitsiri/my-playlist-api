import escapeRegExp from 'escape-regexp';
import { Controller, Get, Query } from '@nestjs/common';
import { SongSearchQueryDto } from './song.dto';
import { Innertube, UniversalCache } from 'youtubei.js';
import { SearchResultModel } from 'src/models/search.result.model';
import { v1 as uuidv1 } from 'uuid';

/**
 * ANCHOR Song Controller
 * @date 19/04/2025 - 15:25:41
 *
 * @export
 * @class SongController
 * @typedef {SongController}
 */
@Controller('song')
export class SongController {
  private yt: Innertube;

  constructor() {
    this._init();
  }

  /**
   * ANCHOR Init
   * @date 21/04/2025 - 18:56:48
   *
   * @async
   * @returns {*}
   */
  async _init() {
    const yt: Innertube = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });

    this.yt = yt;
  }

  @Get('search')
  async search(@Query() query: SongSearchQueryDto): Promise<{
    results: SearchResultModel[];
  }> {
    // q
    const q: string = escapeRegExp(query.q.trim());

    // search
    const search = await this.yt.music.search(q, {
      type: 'song',
    });

    // results
    const results: SearchResultModel[] = [];

    if (search.songs && search.songs.contents.length > 0) {
      for (const content of search.songs.contents) {
        if (content.id && content.title && content.album && content.album.id) {
          // artists name
          let artistsName: string[] = [];

          if (content.artists) {
            artistsName = content.artists.map((e) => e.name);
          }

          // thumbnail
          let thumbnail: string | null = null;

          if (content.thumbnail && content.thumbnail.contents.length > 0) {
            thumbnail = content.thumbnail.contents[0].url;
          }

          // result
          const result: SearchResultModel = {
            id: uuidv1(),
            songId: content.id,
            songTitle: content.title,
            albumId: content.album.id,
            albumName: content.album.name,
            artistsName,
            thumbnail,
          };

          results.push(result);
        }
      }
    }

    return {
      results,
    };
  }
}

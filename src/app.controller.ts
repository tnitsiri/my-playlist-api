import ytdl from '@distube/ytdl-core';
import { All, Controller, Res } from '@nestjs/common';
import { Response } from 'express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { Innertube, UniversalCache, Utils } from 'youtubei.js';
import { ObservedArray, YTNode } from 'youtubei.js/dist/src/parser/helpers';

/**
 * ANCHOR App Controller
 * @date 18/04/2025 - 10:39:46
 *
 * @export
 * @class AppController
 * @typedef {AppController}
 */
@Controller()
export class AppController {
  /**
   * ANCHOR Index
   * @date 18/04/2025 - 10:39:52
   *
   * @returns {[]}
   */
  @All()
  async index(): Promise<[]> {
    // const innertube: Innertube = await Innertube.create();

    // const search = await innertube.search('จำเก่ง', {
    //   type: 'video',
    // });

    // const nodes: YTNode[] = search.results;

    // for (const node of nodes) {
    //   console.log(node);
    // }

    const yt = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });

    const search = await yt.music.search('จำเก่ง', {
      type: 'song',
    });

    if (search.songs && search.songs.contents.length > 0) {
      const song = search.songs.contents[0];

      const stream = await yt.download(song.id as string, {
        type: 'video+audio', // audio, video or video+audio
        quality: 'best', // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
        format: 'mp4', // media container format,
        client: 'YTMUSIC',
      });

      console.info(`Downloading ${song.title} (${song.id})`);

      const dir = `./songs/${song.album?.id}`;

      if (!existsSync(dir)) {
        mkdirSync(dir);
      }

      const file = createWriteStream(`${dir}/${song.id}.m4a`);

      for await (const chunk of Utils.streamToIterable(stream)) {
        file.write(chunk);
      }

      console.info(`${song.id} - Done!`, '\n');
    }

    return [];
  }
}

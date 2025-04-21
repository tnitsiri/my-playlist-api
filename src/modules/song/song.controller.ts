import escapeRegExp from 'escape-regexp';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { SongAddBodyDto, SongSearchQueryDto } from './song.dto';
import { Innertube, UniversalCache, Utils } from 'youtubei.js';
import { SearchResultModel } from 'src/models/search.result.model';
import { v1 as uuidv1 } from 'uuid';
import {
  ClientSession,
  Connection,
  HydratedDocument,
  Model,
  QueryWithHelpers,
  UpdateWriteOpResult,
} from 'mongoose';
import { AudioDocument, Audio } from 'src/schemas/audio.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { PlaylistService } from '../playlist/services/playlist.service';
import { Playlist, PlaylistDocument } from 'src/schemas/playlist.schema';
import { Song } from 'src/schemas/song.schema';
import { SongCacheService } from './services/song.cache.service';
import { CacheService } from 'src/services/cache/cache.service';
import { uniq } from 'lodash';

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
  private readonly logger: Logger = new Logger(SongController.name);

  private yt: Innertube;

  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectModel(Audio.name)
    private readonly audioModel: Model<AudioDocument>,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    private readonly playlistService: PlaylistService,
    private readonly songCacheService: SongCacheService,
    private readonly cacheService: CacheService,
  ) {
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

  /**
   * ANCHOR Add
   * @date 22/04/2025 - 00:28:11
   *
   * @async
   * @param {SongAddBodyDto} body
   * @returns {Promise<[]>}
   */
  @Post('add')
  async add(@Body() body: SongAddBodyDto): Promise<[]> {
    // check duplicate
    if (body.songsId.length != uniq(body.songsId).length) {
      throw new BadRequestException();
    }

    try {
      // playlist
      const playlist: PlaylistDocument | null =
        await this.playlistService.playlist({
          playlistId: body.playlistId,
        });

      if (!playlist) {
        throw new NotFoundException({
          eMessage: 'The requested playlist information was not found.',
        });
      }

      // songs
      const songs: Song[] = [];

      // results
      const results: SearchResultModel[] = [];

      for (const songId of body.songsId) {
        // song
        const song: Song | undefined = playlist.songs.find((e) => {
          return e.songId == songId;
        });

        if (song) {
          throw new BadRequestException({
            eMessage: `"${song.songTitle}"\nis already in the playlist.`,
          });
        }

        // audio
        const audioQuery: QueryWithHelpers<
          HydratedDocument<AudioDocument> | null,
          HydratedDocument<AudioDocument>
        > = this.audioModel.findOne({
          songId,
        });

        const audio: AudioDocument | null = await audioQuery.exec();

        if (audio) {
          // song
          const song: Song = {
            id: uuidv1(),
            songId: audio.songId,
            songTitle: audio.songTitle,
            albumId: audio.albumId,
            albumName: audio.albumName,
            artistsName: audio.artistsName,
            thumbnail: audio.thumbnail,
            durationText: audio.durationText,
            durationSeconds: audio.durationSeconds,
            filePathname: audio.filePathname,
          };

          // songs
          songs.push(song);
        } else {
          // store
          const cacheKey: string = this.songCacheService.searchResultCacheKey({
            songId,
          });

          // result
          const result: SearchResultModel | null =
            await this.cacheService.manager.get(cacheKey);

          if (!result) {
            throw new NotFoundException({
              eMessage: 'Some song information was not found.',
            });
          }

          // results
          results.push(result);
        }
      }

      // audios
      const audios: AudioDocument[] = [];

      for (const result of results) {
        // dir
        const dir = `${process.env.SONG_DIR}/${result.songId}`;

        if (!existsSync(dir)) {
          mkdirSync(dir);
        }

        // file pathname
        const filePathname: string = `${dir}/${result.songId}.m4a`;

        // file
        const file = createWriteStream(filePathname);

        // stream
        const stream = await this.yt.download(result.songId, {
          type: 'video+audio', // audio, video or video+audio
          quality: 'best', // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
          format: 'mp4', // media container format,
          client: 'YTMUSIC',
        });

        for await (const chunk of Utils.streamToIterable(stream)) {
          file.write(chunk);
        }

        // audio
        const audio: AudioDocument = new this.audioModel({
          songId: result.songId,
          songTitle: result.songTitle,
          albumId: result.albumId,
          albumName: result.albumName,
          artistsName: result.artistsName,
          thumbnail: result.thumbnail,
          durationText: result.durationText,
          durationSeconds: result.durationSeconds,
          filePathname,
        });

        // audios
        audios.push(audio);

        // song
        const song: Song = {
          id: uuidv1(),
          songId: audio.songId,
          songTitle: audio.songTitle,
          albumId: audio.albumId,
          albumName: audio.albumName,
          artistsName: audio.artistsName,
          thumbnail: audio.thumbnail,
          durationText: audio.durationText,
          durationSeconds: audio.durationSeconds,
          filePathname: audio.filePathname,
        };

        // songs
        songs.push(song);
      }

      // session
      const session: ClientSession = await this.connection.startSession();
      session.startTransaction();

      try {
        // create audios
        if (audios.length > 0) {
          await this.audioModel.create(audios, {
            session,
            ordered: true,
          });
        }

        // update playlist
        const playlistUpdatedQuery: QueryWithHelpers<
          UpdateWriteOpResult,
          PlaylistDocument
        > = this.playlistModel.updateOne(
          {
            _id: playlist._id,
          },
          {
            $push: {
              songs: {
                $each: songs,
              },
            },
          },
          {
            session,
            runValidators: true,
          },
        );

        const playlistUpdated: UpdateWriteOpResult =
          await playlistUpdatedQuery.exec();

        if (playlistUpdated.modifiedCount != 1) {
          throw new InternalServerErrorException();
        }

        // commit
        await session.commitTransaction();
      } catch (e) {
        if (session.inTransaction()) {
          await session.abortTransaction();
        }

        throw e;
      } finally {
        await session.endSession();
      }

      if (audios.length > 0) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, 1500);
        });
      }
    } catch (e) {
      if (!(e instanceof HttpException)) {
        this.logger.error(e);
      }

      throw e;
    }

    return [];
  }

  /**
   * ANCHOR Search
   * @date 22/04/2025 - 00:14:40
   *
   * @async
   * @param {SongSearchQueryDto} query
   * @returns {Promise<{
   *     results: SearchResultModel[];
   *   }>}
   */
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
        if (
          content.id &&
          content.title &&
          content.album &&
          content.album.id &&
          content.duration
        ) {
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

          // song id
          const songId: string = content.id;

          // result
          const result: SearchResultModel = {
            id: uuidv1(),
            songId,
            songTitle: content.title,
            albumId: content.album.id,
            albumName: content.album.name,
            artistsName,
            thumbnail,
            durationText: content.duration.text,
            durationSeconds: content.duration.seconds,
          };

          results.push(result);

          // store
          const cacheKey: string = this.songCacheService.searchResultCacheKey({
            songId,
          });

          await this.cacheService.manager.set(cacheKey, result);
        }
      }
    }

    return {
      results,
    };
  }
}

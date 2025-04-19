import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { PlaylistFormBodyDto } from './playlist.dto';
import {
  ClientSession,
  Connection,
  HydratedDocument,
  Model,
  QueryWithHelpers,
} from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from 'src/schemas/playlist.schema';
import { PlaylistModel } from 'src/models/playlist.model';
import { PlaylistService } from './services/playlist.service';

/**
 * ANCHOR Playlist Controller
 * @date 18/04/2025 - 11:00:12
 *
 * @export
 * @class PlaylistController
 * @typedef {PlaylistController}
 */
@Controller('playlist')
export class PlaylistController {
  private readonly logger: Logger = new Logger(PlaylistController.name);

  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    private readonly playlistService: PlaylistService,
  ) {}

  /**
   * ANCHOR List
   * @date 19/04/2025 - 11:37:01
   *
   * @async
   * @returns {Promise<{
   *     playlists: PlaylistModel[];
   *   }>}
   */
  @Get('list')
  async list(): Promise<{
    playlists: PlaylistModel[];
  }> {
    // items
    const itemsQuery: QueryWithHelpers<
      HydratedDocument<PlaylistDocument>[],
      HydratedDocument<PlaylistDocument>
    > = this.playlistModel.find().sort({
      title: 1,
    });

    const items: PlaylistDocument[] = await itemsQuery.exec();

    // playlists
    const playlists: PlaylistModel[] = [];

    for (const item of items) {
      // playlist
      const playlist: PlaylistModel = this.playlistService.model({
        playlist: item,
      });

      playlists.push(playlist);
    }

    return {
      playlists,
    };
  }

  /**
   * ANCHOR Create
   * @date 19/04/2025 - 11:27:20
   *
   * @async
   * @param {PlaylistFormBodyDto} body
   * @returns {Promise<{
   *     playlist: PlaylistModel;
   *   }>}
   */
  @Post('create')
  async create(@Body() body: PlaylistFormBodyDto): Promise<{
    playlist: PlaylistModel;
  }> {
    // session
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    // playlist
    let playlist: PlaylistModel | null = null;

    try {
      // create playlist
      const playlists: PlaylistDocument[] = await this.playlistModel.create(
        [
          {
            title: body.title,
            songs: [],
          },
        ],
        {
          session,
        },
      );

      // commit
      await session.commitTransaction();

      // playlist
      playlist = this.playlistService.model({
        playlist: playlists[0],
      });
    } catch (e) {
      if (!(e instanceof HttpException)) {
        this.logger.error(e);
      }

      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      throw e;
    } finally {
      await session.endSession();
    }

    if (!playlist) {
      throw new InternalServerErrorException();
    }

    return {
      playlist,
    };
  }
}

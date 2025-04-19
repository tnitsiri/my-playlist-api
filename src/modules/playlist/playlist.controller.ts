import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PlaylistFormBodyDto } from './playlist.dto';
import {
  ClientSession,
  Connection,
  DeleteResult,
  HydratedDocument,
  Model,
  QueryWithHelpers,
  UpdateWriteOpResult,
} from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from 'src/schemas/playlist.schema';
import { PlaylistModel } from 'src/models/playlist.model';
import { PlaylistService } from './services/playlist.service';
import { ItemParamDto } from 'src/dto/common.dto';

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

  /**
   * ANCHOR Remove
   * @date 19/04/2025 - 14:08:41
   *
   * @async
   * @param {ItemParamDto} param
   * @returns {Promise<[]>}
   */
  @Delete(':id/remove')
  async remove(@Param() param: ItemParamDto): Promise<[]> {
    // session
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    try {
      // playlist
      const playlist: PlaylistDocument | null =
        await this.playlistService.playlist({
          playlistId: param.id,
          session,
        });

      if (!playlist) {
        throw new NotFoundException();
      }

      // delete playlist
      const playlistDeletedQuery: QueryWithHelpers<
        DeleteResult,
        PlaylistDocument
      > = this.playlistModel.deleteOne(
        {
          _id: playlist._id,
        },
        {
          session,
        },
      );

      const playlistDeleted: DeleteResult = await playlistDeletedQuery.exec();

      if (playlistDeleted.deletedCount != 1) {
        throw new InternalServerErrorException();
      }

      // commit
      await session.commitTransaction();
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

    return [];
  }

  /**
   * ANCHOR Update
   * @date 19/04/2025 - 14:42:42
   *
   * @async
   * @param {ItemParamDto} param
   * @param {PlaylistFormBodyDto} body
   * @returns {Promise<{
   *     playlist: PlaylistModel;
   *   }>}
   */
  @Put(':id/update')
  async update(
    @Param() param: ItemParamDto,
    @Body() body: PlaylistFormBodyDto,
  ): Promise<{
    playlist: PlaylistModel;
  }> {
    // session
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    // playlist id
    let playlistId: string | null = null;

    try {
      // playlist
      const playlist: PlaylistDocument | null =
        await this.playlistService.playlist({
          playlistId: param.id,
          session,
        });

      if (!playlist) {
        throw new NotFoundException();
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
          title: body.title,
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

      // playlist id
      playlistId = playlist._id.toString();
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

    if (!playlistId) {
      throw new InternalServerErrorException();
    }

    // playlist
    const playlist: PlaylistModel | null = await this.playlistService.info({
      playlistId,
    });

    if (!playlist) {
      throw new NotFoundException();
    }

    return {
      playlist,
    };
  }

  /**
   * ANCHOR Info
   * @date 19/04/2025 - 12:24:49
   *
   * @async
   * @param {ItemParamDto} param
   * @returns {Promise<{
   *     playlist: PlaylistModel;
   *   }>}
   */
  @Get(':id/info')
  async info(@Param() param: ItemParamDto): Promise<{
    playlist: PlaylistModel;
  }> {
    // playlist
    const playlist: PlaylistModel | null = await this.playlistService.info({
      playlistId: param.id,
    });

    if (!playlist) {
      throw new NotFoundException();
    }

    return {
      playlist,
    };
  }
}

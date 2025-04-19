import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import { PlaylistFormBodyDto } from './playlist.dto';
import { ClientSession, Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from 'src/schemas/playlist.schema';

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
  ) {}

  /**
   * ANCHOR Create
   * @date 18/04/2025 - 11:07:29
   *
   * @async
   * @param {PlaylistFormBodyDto} body
   * @returns {Promise<[]>}
   */
  @Post('create')
  async create(@Body() body: PlaylistFormBodyDto): Promise<[]> {
    // session
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

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

      const playlist: PlaylistDocument = playlists[0];

      console.log(playlist);

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
}

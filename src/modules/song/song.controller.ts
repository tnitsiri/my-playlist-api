import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyService } from '../spotify/services/spotify.service';
import { SongSearchQueryDto } from './song.dto';
import { SpotifySongModel } from 'src/models/spotify.song.model';

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
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('search')
  async search(@Query() query: SongSearchQueryDto): Promise<[]> {
    const songs: SpotifySongModel[] = await this.spotifyService.search(query.q);

    // console.log(songs);

    return [];
  }
}

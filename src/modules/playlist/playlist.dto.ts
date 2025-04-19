import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

/**
 * ANCHOR Playlist Form Body Dto
 * @date 18/04/2025 - 10:59:52
 *
 * @export
 * @class PlaylistFormBodyDto
 * @typedef {PlaylistFormBodyDto}
 */
export class PlaylistFormBodyDto {
  @IsString()
  @Length(1, 300)
  @Transform(({ value }) => (value as string).trim())
  title: string;
}

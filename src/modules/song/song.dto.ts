import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

/**
 * ANCHOR Song Search Query Dto
 * @date 19/04/2025 - 17:29:47
 *
 * @export
 * @class SongSearchQueryDto
 * @typedef {SongSearchQueryDto}
 */
export class SongSearchQueryDto {
  @IsString()
  @Length(1, 300)
  @Transform(({ value }) => (value as string).trim())
  q: string;
}

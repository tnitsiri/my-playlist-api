import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

/**
 * ANCHOR Song Audio Param Dto
 * @date 22/04/2025 - 04:30:01
 *
 * @export
 * @class SongAudioParamDto
 * @typedef {SongAudioParamDto}
 */
export class SongAudioParamDto {
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsString()
  @IsNotEmpty()
  songId: string;
}

/**
 * ANCHOR Song Add Body Dto
 * @date 22/04/2025 - 00:15:27
 *
 * @export
 * @class SongAddBodyDto
 * @typedef {SongAddBodyDto}
 */
export class SongAddBodyDto {
  @IsString()
  @IsMongoId()
  playlistId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  songsId: string[];
}

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

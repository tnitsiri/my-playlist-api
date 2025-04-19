import { IsMongoId, IsString } from 'class-validator';

/**
 * ANCHOR Item Param Dto
 * @date 19/04/2025 - 12:24:16
 *
 * @export
 * @class ItemParamDto
 * @typedef {ItemParamDto}
 */
export class ItemParamDto {
  @IsString()
  @IsMongoId()
  id: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdatePlacementDto {
  @ApiPropertyOptional({ example: '8f7f7f2d-0f41-4a84-9ddc-0d4ef6e9f2e1' })
  @IsOptional()
  @IsUUID()
  sectionUuid?: string;

  @ApiPropertyOptional({ example: 'b0f8e5d1-1b6c-4e9d-a6e4-3f61f4f7cc11' })
  @IsOptional()
  @IsUUID()
  componentUuid?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  componentData?: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  componentSettings?: Record<string, unknown>;
}

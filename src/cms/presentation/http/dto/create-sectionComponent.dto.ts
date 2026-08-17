import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateSectionComponentDto {
  @ApiProperty({ example: 'b0f8e5d1-1b6c-4e9d-a6e4-3f61f4f7cc11' })
  @IsUUID()
  componentId!: string;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  componentData!: Record<string, unknown>;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  componentSettings!: Record<string, unknown>;
}

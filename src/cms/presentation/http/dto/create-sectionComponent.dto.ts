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
  @IsUUID()
  componentId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;

  @IsObject()
  componentData!: Record<string, unknown>;

  @IsObject()
  componentSettings!: Record<string, unknown>;
}

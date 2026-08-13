import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdatePlacementDto {
  @IsOptional()
  @IsUUID()
  sectionUuid?: string;

  @IsOptional()
  @IsUUID()
  componentUuid?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;

  @IsOptional()
  @IsObject()
  componentData?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  componentSettings?: Record<string, unknown>;
}

import { Type } from 'class-transformer';
import { IsInt, IsObject, IsUUID, Min } from 'class-validator';

export class AddComponentToSectionDto {
  @IsUUID()
  sectionId!: string;

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

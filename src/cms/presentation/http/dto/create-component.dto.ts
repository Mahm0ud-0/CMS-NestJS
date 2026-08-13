import { Type } from 'class-transformer';
import { IsString, IsInt, Min, IsOptional, IsUUID } from 'class-validator';

export class CreateComponentDto {
  @IsString()
  nameEN!: string;

  @IsString()
  nameAR!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;

  @IsOptional()
  @IsUUID()
  parentUuid?: string;
}

import { IsBoolean, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePageDto {
  @IsString() nameEN!: string;
  @IsString() nameAR!: string;
  @IsBoolean() isVisible!: boolean;
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;
}

import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSectionDto } from './create-section.dto';

export class UpdatePageDto {
  @IsString() nameEN?: string;
  @IsString() nameAR?: string;
  @IsBoolean() isVisible?: boolean;
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;
  @IsOptional()
  @IsArray()
  @Type(() => CreateSectionDto)
  @ValidateNested({ each: true })
  sections?: CreateSectionDto[];
}

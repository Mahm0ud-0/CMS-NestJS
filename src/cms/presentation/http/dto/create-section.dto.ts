import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateSectionComponentDto } from './create-sectionComponent.dto';

export class CreateSectionDto {
  @IsOptional()
  @IsUUID()
  pageUuid?: string;

  @IsString()
  nameEN!: string;

  @IsString()
  nameAR!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;

  @IsOptional()
  @IsArray()
  @Type(() => CreateSectionComponentDto)
  @ValidateNested({ each: true })
  components?: CreateSectionComponentDto[];
}

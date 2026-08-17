import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ example: '8f7f7f2d-0f41-4a84-9ddc-0d4ef6e9f2e1' })
  @IsOptional()
  @IsUUID()
  pageUuid?: string;

  @ApiProperty({ example: 'Hero Section' })
  @IsString()
  nameEN!: string;

  @ApiProperty({ example: 'هيرو' })
  @IsString()
  nameAR!: string;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;

  @ApiPropertyOptional({ type: () => [CreateSectionComponentDto] })
  @IsOptional()
  @IsArray()
  @Type(() => CreateSectionComponentDto)
  @ValidateNested({ each: true })
  components?: CreateSectionComponentDto[];
}

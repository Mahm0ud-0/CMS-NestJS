import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateSectionDto } from './create-section.dto';

export class CreatePageDto {
  @ApiProperty({ description: 'Page name in English', example: 'Home' })
  @IsString()
  nameEN!: string;

  @ApiProperty({ description: 'Page name in Arabic', example: 'الرئيسية' })
  @IsString()
  nameAR!: string;

  @ApiProperty({
    description: 'Whether the page is visible to public',
    example: true,
  })
  @IsBoolean()
  isVisible!: boolean;

  @ApiProperty({ description: 'Order index of the page', example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;

  @ApiPropertyOptional({
    type: [CreateSectionDto],
    description: 'Sections of the page',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections?: CreateSectionDto[];
}

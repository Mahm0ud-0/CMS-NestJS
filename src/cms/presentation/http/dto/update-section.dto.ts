import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
// import { UpdateComponentDto } from './update-component.dto';

export class UpdateSectionDto {
  @ApiPropertyOptional({ example: '8f7f7f2d-0f41-4a84-9ddc-0d4ef6e9f2e1' })
  @IsOptional()
  @IsUUID()
  pageUuid?: string;

  @ApiPropertyOptional({ example: 'Hero Section' })
  @IsOptional()
  @IsString()
  nameEN?: string;

  @ApiPropertyOptional({ example: 'هيرو' })
  @IsOptional()
  @IsString()
  nameAR?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;

  //   @IsOptional()
  //   @IsArray()
  //   @Type(() => UpdateComponentDto)
  //   @ValidateNested({ each: true })
  //   components?: UpdateComponentDto[];
}

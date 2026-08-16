import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
// import { UpdateComponentDto } from './update-component.dto';

export class UpdateSectionDto {
  @IsOptional()
  @IsUUID()
  pageUuid?: string;

  @IsOptional()
  @IsString()
  nameEN?: string;

  @IsOptional()
  @IsString()
  nameAR?: string;

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

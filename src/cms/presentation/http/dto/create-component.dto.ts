import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, Min, IsOptional, IsUUID } from 'class-validator';

export class CreateComponentDto {
  @ApiProperty({ example: 'Button' })
  @IsString()
  nameEN!: string;

  @ApiProperty({ example: 'زر' })
  @IsString()
  nameAR!: string;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;

  @ApiPropertyOptional({ example: 'b0f8e5d1-1b6c-4e9d-a6e4-3f61f4f7cc11' })
  @IsOptional()
  @IsUUID()
  parentUuid?: string;
}

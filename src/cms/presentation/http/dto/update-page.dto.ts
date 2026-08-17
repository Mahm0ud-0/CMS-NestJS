import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePageDto {
  @ApiProperty({ example: 'Home' })
  @IsString()
  nameEN!: string;
  @ApiProperty({ example: 'الرئيسية' })
  @IsString()
  nameAR!: string;
  @ApiProperty({ example: true })
  @IsBoolean()
  isVisible!: boolean;
  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index!: number;
}

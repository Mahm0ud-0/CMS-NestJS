import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ComponentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEN!: string;

  @ApiProperty()
  nameAR!: string;

  @ApiProperty()
  index!: number;

  @ApiPropertyOptional({ nullable: true })
  parentId!: string | null;
}

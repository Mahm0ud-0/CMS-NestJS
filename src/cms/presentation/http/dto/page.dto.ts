import { ApiProperty } from '@nestjs/swagger';

export class PageSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEN!: string;

  @ApiProperty()
  nameAR!: string;

  @ApiProperty()
  isVisible!: boolean;

  @ApiProperty()
  index!: number;
}

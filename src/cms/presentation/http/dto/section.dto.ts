import { ApiProperty } from '@nestjs/swagger';
import { SectionComponentDto } from './section-component.dto';

export class SectionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEN!: string;

  @ApiProperty()
  nameAR!: string;

  @ApiProperty()
  index!: number;

  @ApiProperty()
  pageId!: string;

  @ApiProperty({ type: () => [SectionComponentDto], required: false })
  sectionComponents?: SectionComponentDto[];
}
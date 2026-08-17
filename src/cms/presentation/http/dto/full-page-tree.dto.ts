import { ApiProperty } from '@nestjs/swagger';

export class PageTreeChildDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEN!: string;

  @ApiProperty()
  nameAR!: string;
}

export class PageTreeComponentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEN!: string;

  @ApiProperty()
  nameAR!: string;

  @ApiProperty({ type: () => [PageTreeChildDto] })
  children!: PageTreeChildDto[];
}

export class FullPageTreeSectionComponentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  index!: number;

  @ApiProperty({ type: 'object', additionalProperties: true })
  componentData!: Record<string, unknown>;

  @ApiProperty({ type: 'object', additionalProperties: true })
  componentSettings!: Record<string, unknown>;

  @ApiProperty({ type: () => PageTreeComponentDto })
  component!: PageTreeComponentDto;
}

export class FullPageTreeSectionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEN!: string;

  @ApiProperty()
  nameAR!: string;

  @ApiProperty()
  index!: number;

  @ApiProperty({ type: () => [FullPageTreeSectionComponentDto] })
  sectionComponents!: FullPageTreeSectionComponentDto[];
}

export class FullPageTreeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEN!: string;

  @ApiProperty()
  nameAR!: string;

  @ApiProperty()
  isVisible!: boolean;

  @ApiProperty({ type: () => [FullPageTreeSectionDto] })
  sections!: FullPageTreeSectionDto[];
}

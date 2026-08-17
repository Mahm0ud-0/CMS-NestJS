import { ApiProperty } from '@nestjs/swagger';

export class SectionComponentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sectionId!: string;

  @ApiProperty()
  componentId!: string;

  @ApiProperty()
  index!: number;

  @ApiProperty({ type: 'object', additionalProperties: true })
  componentData!: Record<string, unknown>;

  @ApiProperty({ type: 'object', additionalProperties: true })
  componentSettings!: Record<string, unknown>;
}
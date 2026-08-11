import { ComponentNodeDto } from './componentNode.dto';

export class SectionDto {
  id!: string;
  nameEN!: string;
  nameAR!: string;
  index!: number;
  components!: ComponentNodeDto[];
}

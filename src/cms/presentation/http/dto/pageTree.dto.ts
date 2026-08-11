import { SectionDto } from './section.dto';

export class PageTreeDto {
  id!: string;
  nameEN!: string;
  nameAR!: string;
  isVisible!: boolean;
  sections!: SectionDto[];
}

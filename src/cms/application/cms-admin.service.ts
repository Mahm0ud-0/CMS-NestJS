import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  I_PAGE_REPOSITORY,
  I_SECTION_REPOSITORY,
  I_COMPONENT_REPOSITORY,
  I_SECTION_COMPONENT_REPOSITORY,
  type ISectionRepository,
  type IPageRepository,
  type IComponentRepository,
  type ISectionComponentRepository,
  type Page,
  type Section,
  SectionComponent,
  FullPageTree,
} from '../domain/cms.types';
import { CreatePageDto } from '../presentation/http/dto/create-page.dto';

@Injectable()
export class CmsAdminService {
  constructor(
    @Inject(I_PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
    @Inject(I_SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
    @Inject(I_COMPONENT_REPOSITORY)
    private readonly componentRepository: IComponentRepository,
    @Inject(I_SECTION_COMPONENT_REPOSITORY)
    private readonly sectionComponentRepository: ISectionComponentRepository,
  ) {}

  // ---- Page ----
  async createPage(dto: CreatePageDto): Promise<FullPageTree> {
    // 1. Page
    const newPage: Page = {
      id: randomUUID(),
      nameEN: dto.nameEN,
      nameAR: dto.nameAR,
      isVisible: dto.isVisible,
      index: dto.index,
    };

    // if no section save and return
    if (!dto.sections || dto.sections.length === 0) {
      await this.pageRepository.save(newPage);
      const page = await this.pageRepository.findByNameEN(dto.nameEN);
      if (!page) throw new Error('Page creation failed');
      return page;
    }

    // 2. Build sections
    const newSections: Section[] = dto.sections.map((secDto) => ({
      id: randomUUID(),
      nameEN: secDto.nameEN,
      nameAR: secDto.nameAR,
      index: secDto.index,
      pageId: newPage.id,
    }));

    // 3. Build section components
    const newSectionComponents: SectionComponent[] = [];

    for (let i = 0; i < dto.sections.length; i++) {
      const sectionDto = dto.sections[i];
      const sectionUuid = newSections[i].id;

      const sectionComponents = sectionDto.components ?? [];
      for (const sc of sectionComponents) {
        newSectionComponents.push({
          id: randomUUID(),
          sectionId: sectionUuid,
          componentId: sc.componentId,
          index: sc.index,
          componentData: sc.componentData,
          componentSettings: sc.componentSettings,
        });
      }
    }

    // 4. save via the repository
    await this.pageRepository.save(newPage, newSections, newSectionComponents);

    // 5. Return assembled full page tree
    const page = await this.pageRepository.findByNameEN(dto.nameEN);
    if (!page) throw new Error('Page creation failed');
    return page;
  }
}

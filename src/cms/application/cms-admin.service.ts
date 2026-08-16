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
  Component,
} from '../domain/cms.types';
import { CreatePageDto } from '../presentation/http/dto/create-page.dto';
import { CreateSectionDto } from '../presentation/http/dto/create-section.dto';
import { UpdateSectionDto } from '../presentation/http/dto/update-section.dto';
import { CreateComponentDto } from '../presentation/http/dto/create-component.dto';
import { AddComponentToSectionDto } from '../presentation/http/dto/add-ComponentToSection.dto';
import { UpdatePageDto } from '../presentation/http/dto/update-page.dto';

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

  async getAllPages(): Promise<Page[]> {
    return this.pageRepository.findAll();
  }

  async createPage(dto: CreatePageDto): Promise<FullPageTree> {
    // 1. Page
    const newPage: Page = {
      id: randomUUID(),
      nameEN: dto.nameEN,
      nameAR: dto.nameAR,
      isVisible: dto.isVisible || false,
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

  async updatePage(uuid: string, dto: UpdatePageDto): Promise<Page> {
    const updatedPage: Pick<Page, 'nameAR' | 'nameEN' | 'isVisible' | 'index'> =
      {
        nameEN: dto.nameEN,
        nameAR: dto.nameAR,
        isVisible: dto.isVisible,
        index: dto.index,
      };

    const result = await this.pageRepository.update(uuid, updatedPage);
    if (!result) throw new Error('Page update failed');
    return result;
  }

  async deletePage(uuid: string): Promise<boolean> {
    return await this.pageRepository.delete(uuid);
  }

  // ========================== sections ==========================

  async createSection(pageId: string, dto: CreateSectionDto): Promise<Section> {
    const newSection: Section = {
      id: randomUUID(),
      nameEN: dto.nameEN,
      nameAR: dto.nameAR,
      index: dto.index,
      pageId: pageId,
    };

    const result = await this.sectionRepository.save(newSection);
    if (!result) throw new Error('Section creation failed');
    return result;
  }

  async updateSection(
    sectionUuid: string,
    dto: UpdateSectionDto,
  ): Promise<Section> {
    const updatedSection: Partial<Section> = {
      id: sectionUuid,
      nameEN: dto?.nameEN,
      nameAR: dto?.nameAR,
      index: dto?.index,
      pageId: dto?.pageUuid,
    };

    const result = await this.sectionRepository.update(
      sectionUuid,
      updatedSection,
    );
    if (!result) throw new Error('Section update failed');
    return result;
  }

  async deleteSection(sectionUuid: string): Promise<boolean> {
    return await this.sectionRepository.delete(sectionUuid);
  }

  // ========================== components ==========================

  async getAllComponents(): Promise<Component[]> {
    return this.componentRepository.findAll();
  }

  async createComponent(dto: CreateComponentDto): Promise<Component> {
    const newComponent: Component = {
      id: randomUUID(),
      nameEN: dto.nameEN,
      nameAR: dto.nameAR,
      index: dto.index,
      parentId: dto.parentUuid || null,
    };

    const result = await this.componentRepository.save(newComponent);
    if (!result) throw new Error('Component creation failed');
    return result;
  }

  async updateComponent(
    componentUuid: string,
    dto: CreateComponentDto,
  ): Promise<Component> {
    const updatedComponent: Partial<Component> = {
      id: componentUuid,
      nameEN: dto.nameEN,
      nameAR: dto.nameAR,
      index: dto.index,
      parentId: dto?.parentUuid,
    };

    const result = await this.componentRepository.update(
      componentUuid,
      updatedComponent,
    );
    if (!result) throw new Error('Component update failed');
    return result;
  }

  async deleteComponent(componentUuid: string): Promise<boolean> {
    return await this.componentRepository.delete(componentUuid);
  }

  async addComponentToSection(
    sectionId: string,
    dto: AddComponentToSectionDto,
  ): Promise<SectionComponent> {
    const newSectionComponent: SectionComponent = {
      id: randomUUID(),
      sectionId: sectionId,
      componentId: dto.componentId,
      index: dto.index,
      componentData: dto.componentData,
      componentSettings: dto.componentSettings,
    };
    return await this.sectionComponentRepository.save(newSectionComponent);
  }

  async updateSectionComponent(
    sectionComponentUuid: string,
    dto: Pick<
      AddComponentToSectionDto,
      'index' | 'componentData' | 'componentSettings'
    >,
  ): Promise<SectionComponent> {
    const updatedSectionComponent: Pick<
      AddComponentToSectionDto,
      'index' | 'componentData' | 'componentSettings'
    > = {
      index: dto.index,
      componentData: dto.componentData,
      componentSettings: dto.componentSettings,
    };
    return await this.sectionComponentRepository.update(
      sectionComponentUuid,
      updatedSectionComponent,
    );
  }

  async deleteSectionComponent(sectionComponentUuid: string): Promise<boolean> {
    return await this.sectionComponentRepository.delete(sectionComponentUuid);
  }
}

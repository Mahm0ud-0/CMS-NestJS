import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  I_PAGE_REPOSITORY,
  // I_SECTION_REPOSITORY,
  // I_COMPONENT_REPOSITORY,
  // I_SECTION_COMPONENT_REPOSITORY,
  // type ISectionRepository,
  // type IComponentRepository,
  // type ISectionComponentRepository,
  type IPageRepository,
  Page,
  FullPageTree,
} from '../domain/cms.types';

@Injectable()
export class CmsPublicService {
  constructor(
    @Inject(I_PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
    // @Inject(I_SECTION_REPOSITORY)
    // private readonly sectionRepository: ISectionRepository,
    // @Inject(I_COMPONENT_REPOSITORY)
    // private readonly componentRepository: IComponentRepository,
    // @Inject(I_SECTION_COMPONENT_REPOSITORY)
    // private readonly sectionComponentRepository: ISectionComponentRepository,
  ) {}

  async getALLVisiblePages(): Promise<Page[]> {
    const pages = await this.pageRepository.findAllVisible();
    return pages;
  }

  async getPageByName(name: string): Promise<FullPageTree> {
    const page = await this.pageRepository.findByNameEN(name);

    if (!page) {
      throw new NotFoundException(`Page "${name}" was not found`);
    }
    return page;
  }
}

// import { Inject, Injectable } from '@nestjs/common';
// import {
//   I_PAGE_REPOSITORY,
//   I_SECTION_REPOSITORY,
//   I_COMPONENT_REPOSITORY,
//   I_SECTION_COMPONENT_REPOSITORY,
//   type ISectionRepository,
//   type IPageRepository,
//   type IComponentRepository,
//   type ISectionComponentRepository,
//   SectionComponent,
// } from '../domain/cms.types';

// @Injectable()
// export class CmsAdminService {
//   constructor(
//     @Inject(I_PAGE_REPOSITORY)
//     private readonly pageRepository: IPageRepository,
//     @Inject(I_SECTION_REPOSITORY)
//     private readonly sectionRepository: ISectionRepository,
//     @Inject(I_COMPONENT_REPOSITORY)
//     private readonly componentRepository: IComponentRepository,
//     @Inject(I_SECTION_COMPONENT_REPOSITORY)
//     private readonly sectionComponentRepository: ISectionComponentRepository,
//   ) {}

//   // ---- Page ----
//   async createPage(dto: CreatePageDto): Promise<PageTreeDto> {
//     // Transactional: create page, sections, placements
//     // then fetch & return full tree
//   }

//   async updatePage(pageUuid: string, dto: UpdatePageDto): Promise<PageTreeDto> {
//     // Full replacement: delete old sections/placements, recreate
//   }

//   async deletePage(pageUuid: string): Promise<void> {
//     //...
//   }

//   // ---- Section ----
//   async createSection(dto: CreateSectionDto): Promise<Section> {
//     //...
//   }
//   async updateSection(
//     sectionUuid: string,
//     dto: UpdateSectionDto,
//   ): Promise<Section> {
//     //...
//   }
//   async deleteSection(sectionUuid: string): Promise<void> {
//     //...
//   }

//   // ---- Component ----
//   async createComponent(dto: CreateComponentDto): Promise<Component> {
//     //...
//   }
//   async updateComponent(
//     compUuid: string,
//     dto: UpdateComponentDto,
//   ): Promise<Component> {
//     //...
//   }
//   async deleteComponent(compUuid: string): Promise<void> {
//     //...
//   }

//   // ---- Section-Component placements ----
//   async addComponentToSection(
//     dto: AddComponentToSectionDto,
//   ): Promise<SectionComponent> {
//     //...
//   }
//   async updatePlacement(
//     placementUuid: string,
//     dto: UpdatePlacementDto,
//   ): Promise<SectionComponent> {
//     //...
//   }
//   async removePlacement(placementUuid: string): Promise<void> {
//     //...
//   }
// }

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  Component,
  FullPageTree,
  Page,
  Section,
  SectionComponent,
} from '../../domain/cms.types';
import { CreatePageDto } from './dto/create-page.dto';
import { CmsAdminService } from '../../application/cms-admin.service';
import { PageSummaryDto } from './dto/page.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateComponentDto } from './dto/create-component.dto';
import { AddComponentToSectionDto } from './dto/add-ComponentToSection.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('admin')
export class AdminCmsController {
  constructor(private readonly cmsAdminService: CmsAdminService) {}

  @Get('/pages')
  async getAllPages(): Promise<Page[]> {
    return this.cmsAdminService.getAllPages();
  }

  @Post('/pages')
  async createPage(@Body() dto: CreatePageDto): Promise<FullPageTree> {
    return this.cmsAdminService.createPage(dto);
  }

  // PUT /admin/pages/:pageUuid
  @Put('/pages/:pageUuid')
  async updatePage(
    @Param('pageUuid') pageUuid: string,
    @Body() dto: UpdatePageDto,
  ): Promise<PageSummaryDto> {
    const updatedPage = await this.cmsAdminService.updatePage(pageUuid, dto);
    return updatedPage;
  }

  // DELETE /admin/pages/:pageUuid
  @Delete('/pages/:pageUuid')
  async deletePage(@Param('pageUuid') pageUuid: string): Promise<boolean> {
    return this.cmsAdminService.deletePage(pageUuid);
  }

  // POST /admin/pages/:pageId/sections
  @Post('/pages/:pageId/sections')
  async createSection(
    @Param('pageId') pageId: string,
    @Body() dto: CreateSectionDto,
  ): Promise<Section> {
    return this.cmsAdminService.createSection(pageId, dto);
  }

  // PUT /admin/sections:sectionUuid
  @Put('/sections/:sectionUuid')
  async updateSection(
    @Param('sectionUuid') sectionUuid: string,
    @Body() dto: CreateSectionDto,
  ): Promise<Section> {
    return this.cmsAdminService.updateSection(sectionUuid, dto);
  }
  // DELETE /admin/sections/:sectionUuid
  @Delete('/sections/:sectionUuid')
  async deleteSection(
    @Param('sectionUuid') sectionUuid: string,
  ): Promise<boolean> {
    return this.cmsAdminService.deleteSection(sectionUuid);
  }

  @Get('/components')
  async getAllComponents(): Promise<Component[]> {
    return this.cmsAdminService.getAllComponents();
  }

  // POST /admin/components
  @Post('/components')
  async createComponent(@Body() dto: CreateComponentDto): Promise<Component> {
    return this.cmsAdminService.createComponent(dto);
  }

  // PUT /admin/components/:componentUuid
  @Put('/components/:componentUuid')
  async updateComponent(
    @Param('componentUuid') componentUuid: string,
    @Body() dto: CreateComponentDto,
  ): Promise<Component> {
    return this.cmsAdminService.updateComponent(componentUuid, dto);
  }

  // DELETE /admin/components/:componentUuid
  @Delete('/components/:componentUuid')
  async deleteComponent(
    @Param('componentUuid') componentUuid: string,
  ): Promise<boolean> {
    return this.cmsAdminService.deleteComponent(componentUuid);
  }

  // POST /admin/sections/:sectionId/components
  @Post('/sections/:sectionId/components')
  async createSectionComponent(
    @Param('sectionId') sectionId: string,
    @Body() dto: AddComponentToSectionDto,
  ): Promise<SectionComponent> {
    return this.cmsAdminService.addComponentToSection(sectionId, dto);
  }

  // PUT /admin/sections/:sectionId/components:sectionComponentUuid
  @Put('/sections/:sectionId/components/:sectionComponentUuid')
  async updateSectionComponent(
    @Param('sectionComponentUuid') sectionComponentUuid: string,
    @Body() dto: AddComponentToSectionDto,
  ): Promise<SectionComponent> {
    return this.cmsAdminService.updateSectionComponent(
      sectionComponentUuid,
      dto,
    );
  }
  // DELETE /admin/sections/:sectionId/components:sectionComponentUuid
  @Delete('/sections/:sectionId/components/:sectionComponentUuid')
  async deleteSectionComponent(
    @Param('sectionComponentUuid') sectionComponentUuid: string,
  ): Promise<boolean> {
    return this.cmsAdminService.deleteSectionComponent(sectionComponentUuid);
  }
}

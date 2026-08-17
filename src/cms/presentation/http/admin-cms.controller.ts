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
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePageDto } from './dto/create-page.dto';
import { CmsAdminService } from '../../application/cms-admin.service';
import { PageSummaryDto } from './dto/page.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateComponentDto } from './dto/create-component.dto';
import { AddComponentToSectionDto } from './dto/add-ComponentToSection.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { ComponentDto } from './dto/component.dto';
import { SectionDto } from './dto/section.dto';
import { SectionComponentDto } from './dto/section-component.dto';
import { FullPageTreeDto } from './dto/full-page-tree.dto';

@ApiTags('Admin CMS')
@ApiBearerAuth()
@Controller('admin')
@Controller('admin')
export class AdminCmsController {
  constructor(private readonly cmsAdminService: CmsAdminService) {}

  @Get('/pages')
  @ApiOkResponse({ type: [PageSummaryDto] })
  async getAllPages(): Promise<PageSummaryDto[]> {
    return this.cmsAdminService.getAllPages();
  }

  @Post('/pages')
  @ApiBody({ type: CreatePageDto })
  @ApiCreatedResponse({ type: FullPageTreeDto })
  async createPage(@Body() dto: CreatePageDto): Promise<FullPageTreeDto> {
    return this.cmsAdminService.createPage(dto);
  }

  // PUT /admin/pages/:pageUuid
  @Put('/pages/:pageUuid')
  @ApiParam({ name: 'pageUuid', type: String })
  @ApiBody({ type: UpdatePageDto })
  @ApiOkResponse({ type: PageSummaryDto })
  async updatePage(
    @Param('pageUuid') pageUuid: string,
    @Body() dto: UpdatePageDto,
  ): Promise<PageSummaryDto> {
    const updatedPage = await this.cmsAdminService.updatePage(pageUuid, dto);
    return updatedPage;
  }

  // DELETE /admin/pages/:pageUuid
  @Delete('/pages/:pageUuid')
  @ApiParam({ name: 'pageUuid', type: String })
  @ApiNoContentResponse()
  async deletePage(@Param('pageUuid') pageUuid: string): Promise<boolean> {
    return this.cmsAdminService.deletePage(pageUuid);
  }

  // POST /admin/pages/:pageId/sections
  @Post('/pages/:pageId/sections')
  @ApiParam({ name: 'pageId', type: String })
  @ApiBody({ type: CreateSectionDto })
  @ApiCreatedResponse({ type: SectionDto })
  async createSection(
    @Param('pageId') pageId: string,
    @Body() dto: CreateSectionDto,
  ): Promise<SectionDto> {
    return this.cmsAdminService.createSection(pageId, dto);
  }

  // PUT /admin/sections:sectionUuid
  @Put('/sections/:sectionUuid')
  @ApiParam({ name: 'sectionUuid', type: String })
  @ApiBody({ type: CreateSectionDto })
  @ApiOkResponse({ type: SectionDto })
  async updateSection(
    @Param('sectionUuid') sectionUuid: string,
    @Body() dto: CreateSectionDto,
  ): Promise<SectionDto> {
    return this.cmsAdminService.updateSection(sectionUuid, dto);
  }
  // DELETE /admin/sections/:sectionUuid
  @Delete('/sections/:sectionUuid')
  @ApiParam({ name: 'sectionUuid', type: String })
  @ApiNoContentResponse()
  async deleteSection(
    @Param('sectionUuid') sectionUuid: string,
  ): Promise<boolean> {
    return this.cmsAdminService.deleteSection(sectionUuid);
  }

  @Get('/components')
  @ApiOkResponse({ type: [ComponentDto] })
  async getAllComponents(): Promise<ComponentDto[]> {
    return this.cmsAdminService.getAllComponents();
  }

  // POST /admin/components
  @Post('/components')
  @ApiBody({ type: CreateComponentDto })
  @ApiCreatedResponse({ type: ComponentDto })
  async createComponent(
    @Body() dto: CreateComponentDto,
  ): Promise<ComponentDto> {
    return this.cmsAdminService.createComponent(dto);
  }

  // PUT /admin/components/:componentUuid
  @Put('/components/:componentUuid')
  @ApiParam({ name: 'componentUuid', type: String })
  @ApiBody({ type: CreateComponentDto })
  @ApiOkResponse({ type: ComponentDto })
  async updateComponent(
    @Param('componentUuid') componentUuid: string,
    @Body() dto: CreateComponentDto,
  ): Promise<ComponentDto> {
    return this.cmsAdminService.updateComponent(componentUuid, dto);
  }

  // DELETE /admin/components/:componentUuid
  @Delete('/components/:componentUuid')
  @ApiParam({ name: 'componentUuid', type: String })
  @ApiNoContentResponse()
  async deleteComponent(
    @Param('componentUuid') componentUuid: string,
  ): Promise<boolean> {
    return this.cmsAdminService.deleteComponent(componentUuid);
  }

  // POST /admin/sections/:sectionId/components
  @Post('/sections/:sectionId/components')
  @ApiParam({ name: 'sectionId', type: String })
  @ApiBody({ type: AddComponentToSectionDto })
  @ApiCreatedResponse({ type: SectionComponentDto })
  async createSectionComponent(
    @Param('sectionId') sectionId: string,
    @Body() dto: AddComponentToSectionDto,
  ): Promise<SectionComponentDto> {
    return this.cmsAdminService.addComponentToSection(sectionId, dto);
  }

  // PUT /admin/sections/:sectionId/components:sectionComponentUuid
  @Put('/sections/:sectionId/components/:sectionComponentUuid')
  @ApiParam({ name: 'sectionId', type: String })
  @ApiParam({ name: 'sectionComponentUuid', type: String })
  @ApiBody({ type: AddComponentToSectionDto })
  @ApiOkResponse({ type: SectionComponentDto })
  async updateSectionComponent(
    @Param('sectionComponentUuid') sectionComponentUuid: string,
    @Body() dto: AddComponentToSectionDto,
  ): Promise<SectionComponentDto> {
    return this.cmsAdminService.updateSectionComponent(
      sectionComponentUuid,
      dto,
    );
  }
  // DELETE /admin/sections/:sectionId/components:sectionComponentUuid
  @Delete('/sections/:sectionId/components/:sectionComponentUuid')
  @ApiParam({ name: 'sectionId', type: String })
  @ApiParam({ name: 'sectionComponentUuid', type: String })
  @ApiNoContentResponse()
  async deleteSectionComponent(
    @Param('sectionComponentUuid') sectionComponentUuid: string,
  ): Promise<boolean> {
    return this.cmsAdminService.deleteSectionComponent(sectionComponentUuid);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { FullPageTree } from '../../domain/cms.types';
import { CreatePageDto } from './dto/create-page.dto';
import { CmsAdminService } from '../../application/cms-admin.service';

@Controller('admin')
export class AdminCmsController {
  constructor(private readonly cmsAdminService: CmsAdminService) {}

  @Post('/pages')
  async createPage(@Body() dto: CreatePageDto): Promise<FullPageTree> {
    return this.cmsAdminService.createPage(dto);
  }
}

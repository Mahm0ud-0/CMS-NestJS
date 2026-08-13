import { Controller, Get, Param } from '@nestjs/common';
import { CmsPublicService } from '../../application/cms-public.service';
import { Public } from '../../../shared/decorators/public.decorator';
import { PageSummaryDto } from './dto/page.dto';
import { FullPageTree } from '../../domain/cms.types';

@Controller('pages')
export class PublicCmsController {
  constructor(private readonly cmsPublicService: CmsPublicService) {}

  @Public()
  @Get('/')
  async getAllVisiblePages(): Promise<PageSummaryDto[]> {
    return this.cmsPublicService.getALLVisiblePages();
  }

  @Public()
  @Get(':name')
  async getPageByName(@Param('name') name: string): Promise<FullPageTree> {
    return this.cmsPublicService.getPageByName(name);
  }
}

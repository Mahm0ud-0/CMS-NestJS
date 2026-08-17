import { Controller, Get, Param } from '@nestjs/common';
import { CmsPublicService } from '../../application/cms-public.service';
import { Public } from '../../../shared/decorators/public.decorator';
import { PageSummaryDto } from './dto/page.dto';
import { FullPageTreeDto } from './dto/full-page-tree.dto';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Public Pages')
@Controller('pages')
export class PublicCmsController {
  constructor(private readonly cmsPublicService: CmsPublicService) {}

  @Public()
  @Get('/')
  @ApiOkResponse({ type: [PageSummaryDto] })
  async getAllVisiblePages(): Promise<PageSummaryDto[]> {
    return this.cmsPublicService.getALLVisiblePages();
  }

  @Public()
  @Get(':name')
  @ApiParam({ name: 'name', type: String })
  @ApiOkResponse({ type: FullPageTreeDto })
  async getPageByName(@Param('name') name: string): Promise<FullPageTreeDto> {
    return this.cmsPublicService.getPageByName(name);
  }
}

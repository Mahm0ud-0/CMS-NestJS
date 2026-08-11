import { Module } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma/prisma.service';
import {
  I_COMPONENT_REPOSITORY,
  I_PAGE_REPOSITORY,
  I_SECTION_COMPONENT_REPOSITORY,
  I_SECTION_REPOSITORY,
} from './domain/cms.types';
import { PagePrismaRepository } from './infrastructure/page.prisma.repository';
import { SectionPrismaRepository } from './infrastructure/section.prisma.repository';
import { ComponentPrismaRepository } from './infrastructure/component.prisma.repository';
import { SectionComponentPrismaRepository } from './infrastructure/sectionComponent.prisma.repository';
import { CmsPublicService } from './application/cms-public.service';
// import { CmsAdminService } from './application/cms-admin.service';
import { PublicCmsController } from './presentation/http/public-cms.controller';

@Module({
  providers: [
    PrismaService,
    { provide: I_PAGE_REPOSITORY, useClass: PagePrismaRepository },
    { provide: I_SECTION_REPOSITORY, useClass: SectionPrismaRepository },
    { provide: I_COMPONENT_REPOSITORY, useClass: ComponentPrismaRepository },
    {
      provide: I_SECTION_COMPONENT_REPOSITORY,
      useClass: SectionComponentPrismaRepository,
    },
    CmsPublicService,
    // CmsAdminService,
  ],
  controllers: [PublicCmsController],
})
export class CmsModule {}

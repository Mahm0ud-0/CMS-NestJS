import { Injectable } from '@nestjs/common';
import {
  FullPageTree,
  IPageRepository,
  Page,
  Section,
  SectionComponent,
} from '../domain/cms.types';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class PagePrismaRepository implements IPageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllVisible(): Promise<Page[]> {
    const pages = await this.prisma.page.findMany({
      where: { isVisible: true },
      orderBy: { index: 'asc' },
    });
    return pages.map((r) => this.toDomain(r));
  }

  async findByUuid(uuid: string): Promise<FullPageTree | null> {
    const page = await this.prisma.page.findUnique({
      where: { uuid },
      include: {
        sections: {
          orderBy: { index: 'asc' },
          include: {
            sectionComponents: {
              orderBy: { index: 'asc' },
              include: {
                component: {
                  include: { children: true },
                },
              },
            },
          },
        },
      },
    });

    return page ? this.toDomainFullPageTree(page) : null;
  }

  async findByNameEN(name: string): Promise<FullPageTree | null> {
    // TODO: make name unique and use findunique
    const page = await this.prisma.page.findFirst({
      where: { nameEN: name },
      include: {
        sections: {
          orderBy: { index: 'asc' },
          include: {
            sectionComponents: {
              orderBy: { index: 'asc' },
              include: {
                component: {
                  include: { children: true },
                },
              },
            },
          },
        },
      },
    });

    return page ? this.toDomainFullPageTree(page) : null;
  }

  async save(
    page: Page,
    sections?: Section[],
    sectionComponents?: SectionComponent[],
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. create the page and get its ID
      const createdPage = await tx.page.create({
        data: {
          uuid: page.id,
          nameEN: page.nameEN,
          nameAR: page.nameAR,
          isVisible: page.isVisible,
          index: page.index,
        },
        select: { id: true },
      });

      // 2. create sections if exists and save IDs
      const sectionIntIds = new Map<string, number>();

      for (const section of sections as Array<Section>) {
        const createdSection = await tx.section.create({
          data: {
            uuid: section.id,
            nameEN: section.nameEN,
            nameAR: section.nameAR,
            index: section.index,
            pageId: createdPage.id,
          },
          select: { id: true }, // save ID to link the components plaved in section
        });

        // store the mapping of section UUID to its internal ID
        sectionIntIds.set(section.id, createdSection.id);
      }

      // 3. create placements if exists
      const componentUuids = [
        ...new Set(sectionComponents?.map((sc) => sc.componentId)),
      ];

      // fetch all used components integer IDs
      const components = await tx.component.findMany({
        where: { uuid: { in: componentUuids } },
        select: { id: true, uuid: true },
      });
      const componentIntIdMap = new Map(components.map((c) => [c.uuid, c.id]));

      for (const placement of sectionComponents as Array<SectionComponent>) {
        const sectionIntId = sectionIntIds.get(placement.sectionId) as number;
        const componentIntId = componentIntIdMap.get(
          placement.componentId,
        ) as number;
        if (!sectionIntId) {
          throw new Error(
            `Section with uuid ${placement.sectionId} not found `,
          );
        }
        if (!componentIntId) {
          throw new Error(
            `Component with uuid ${placement.componentId} not found `,
          );
        }

        const createdPlacement = await tx.sectionComponent.create({
          data: {
            uuid: placement.id,
            index: placement.index,
            sectionId: sectionIntId,
            componentId: componentIntId,
            componentData: placement.componentData,
            componentSettings: placement.componentSettings,
          },
        });
      }
    });
  }

  async delete(uuid: string): Promise<void> {
    await this.prisma.page.delete({ where: { uuid } });
  }

  private toDomain(pageRecord: any): Page {
    return {
      id: pageRecord.uuid,
      nameEN: pageRecord.nameEN,
      nameAR: pageRecord.nameAR,
      isVisible: pageRecord.isVisible,
      index: pageRecord.index,
    };
  }

  private toDomainFullPageTree(pageRecord: any): FullPageTree {
    return {
      id: pageRecord.uuid,
      nameEN: pageRecord.nameEN,
      nameAR: pageRecord.nameAR,
      isVisible: pageRecord.isVisible,
      sections: pageRecord.sections.map((section: any) => ({
        id: section.uuid,
        nameEN: section.nameEN,
        nameAR: section.nameAR,
        index: section.index,
        sectionComponents: section.sectionComponents.map((sc: any) => ({
          id: sc.uuid,
          index: sc.index,
          componentData: sc.componentData,
          componentSettings: sc.componentSettings,
          component: {
            id: sc.component.uuid,
            nameEN: sc.component.nameEN,
            nameAR: sc.component.nameAR,
            children: sc.component.children.map((child: any) => ({
              id: child.uuid,
              nameEN: child.nameEN,
              nameAR: child.nameAR,
            })),
          },
        })),
      })),
    };
  }
}

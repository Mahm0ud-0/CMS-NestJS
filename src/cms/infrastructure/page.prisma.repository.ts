import { Injectable } from '@nestjs/common';
import { FullPageTree, IPageRepository, Page } from '../domain/cms.types';
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

  async findByUuid(uuid: string): Promise<Page | null> {
    const page = await this.prisma.page.findUnique({
      where: { uuid },
    });
    return page ? this.toDomain(page) : null;
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

    // const sections = await this.prisma.section.findMany({
    //   where: { pageId: page.id },
    //   orderBy: { index: 'asc' },
    // });

    // const sectionsWithPlacements = await Promise.all(
    //   sections.map(async (section) => {
    //     const placements = await this.prisma.sectionComponent.findMany({
    //       where: { sectionId: section.id },
    //       include: {
    //         component: {
    //           include: {
    //             children: true,
    //           },
    //         },
    //       },
    //       orderBy: { index: 'asc' },
    //     });

    //     return {
    //       id: section.uuid,
    //       nameEN: section.nameEN,
    //       nameAR: section.nameAR,
    //       index: section.index,
    //       placements: placements.map((p) => ({
    //         componentData: p.componentData,
    //         componentSettings: p.componentSettings,
    //         component: {
    //           id: p.component.uuid,
    //           nameEN: p.component.nameEN,
    //           nameAR: p.component.nameAR,
    //           children: p.component.children.map((child) => ({
    //             id: child.uuid,
    //             nameEN: child.nameEN,
    //             nameAR: child.nameAR,
    //           })),
    //         },
    //       })),
    //     };
    //   }),
    // );

    // return {
    //   id: page.uuid,
    //   nameEN: page.nameEN,
    //   nameAR: page.nameAR,
    //   isVisible: page.isVisible,
    //   sections: sectionsWithPlacements,
    // };
  }

  async save(page: Page): Promise<void> {
    await this.prisma.page.upsert({
      where: { uuid: page.id },
      update: {
        nameEN: page.nameEN,
        nameAR: page.nameAR,
        isVisible: page.isVisible,
        index: page.index,
      },
      create: {
        uuid: page.id,
        nameEN: page.nameEN,
        nameAR: page.nameAR,
        isVisible: page.isVisible,
        index: page.index,
      },
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

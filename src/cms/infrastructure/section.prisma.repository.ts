import { Injectable, NotFoundException } from '@nestjs/common';
import { ISectionRepository, Section } from '../domain/cms.types';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class SectionPrismaRepository implements ISectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByPageUuid(pageUuid: string): Promise<Section[]> {
    const records = await this.prisma.section.findMany({
      where: { page: { uuid: pageUuid } },
      include: { page: { select: { uuid: true } } },
      orderBy: { index: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findByUuid(uuid: string): Promise<Section | null> {
    const record = await this.prisma.section.findUnique({
      where: { uuid },
      include: { page: { select: { uuid: true } } },
    });
    return record ? this.toDomain(record) : null;
  }

  async save(section: Section): Promise<void> {
    const page = await this.prisma.page.findUnique({
      where: { uuid: section.pageId },
    });
    if (!page)
      throw new NotFoundException(`Page with ID ${section.pageId} not found`);

    await this.prisma.section.upsert({
      where: { uuid: section.id },
      update: {
        nameEN: section.nameEN,
        nameAR: section.nameAR,
        index: section.index,
      },
      create: {
        uuid: section.id,
        nameEN: section.nameEN,
        nameAR: section.nameAR,
        index: section.index,
        pageId: page.id, // integer FK
      },
    });
  }

  async delete(uuid: string): Promise<void> {
    await this.prisma.section.delete({ where: { uuid } });
  }

  private toDomain(record: any): Section {
    return {
      id: record.uuid,
      nameEN: record.nameEN,
      nameAR: record.nameAR,
      index: record.index,
      pageId: record.page.uuid,
    };
  }
}

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

  async save(section: Section): Promise<Section | null> {
    const page = await this.prisma.page.findUnique({
      where: { uuid: section.pageId },
    });
    if (!page)
      throw new NotFoundException(`Page with ID ${section.pageId} not found`);

    const result = await this.prisma.section.upsert({
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
      include: { page: { select: { uuid: true } } },
    });

    return result ? this.toDomain(result) : null;
  }

  async update(
    sectionUuid: string,
    section: Partial<Section>,
  ): Promise<Section | null> {
    const updatedSection = await this.prisma.section.update({
      where: { uuid: sectionUuid },
      data: {
        index: section.index,
        nameEN: section.nameEN,
        nameAR: section.nameAR,
      },
      include: { page: { select: { uuid: true } } },
    });
    return updatedSection ? this.toDomain(updatedSection) : null;
  }

  async delete(uuid: string): Promise<boolean> {
    await this.prisma.section.delete({ where: { uuid } });
    return true;
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

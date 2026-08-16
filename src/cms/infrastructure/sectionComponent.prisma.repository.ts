import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import {
  ISectionComponentRepository,
  SectionComponent,
} from '../domain/cms.types';

@Injectable()
export class SectionComponentPrismaRepository implements ISectionComponentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySectionUuid(sectionUuid: string): Promise<SectionComponent[]> {
    const records = await this.prisma.sectionComponent.findMany({
      where: { section: { uuid: sectionUuid } },
      include: {
        section: { select: { uuid: true } },
        component: { select: { uuid: true } },
      },
      orderBy: { index: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async save(sc: SectionComponent): Promise<SectionComponent> {
    const section = await this.prisma.section.findUnique({
      where: { uuid: sc.sectionId },
    });
    const component = await this.prisma.component.findUnique({
      where: { uuid: sc.componentId },
    });
    if (!section)
      throw new Error(`Section with UUID ${sc.sectionId} not found`);
    if (!component)
      throw new Error(`Component with UUID ${sc.componentId} not found`);

    const result = await this.prisma.sectionComponent.upsert({
      where: { uuid: sc.id },
      update: {
        componentData: sc.componentData,
        componentSettings: sc.componentSettings,
        index: sc.index,
      },
      create: {
        uuid: sc.id,
        sectionId: section.id,
        componentId: component.id,
        componentData: sc.componentData,
        componentSettings: sc.componentSettings,
        index: sc.index,
      },
      include: {
        section: { select: { uuid: true } },
        component: { select: { uuid: true } },
      },
    });
    return this.toDomain(result);
  }

  async update(
    uuid: string,
    sc: Partial<SectionComponent>,
  ): Promise<SectionComponent> {
    const updated = await this.prisma.sectionComponent.update({
      where: { uuid },
      data: {
        componentData: sc.componentData,
        componentSettings: sc.componentSettings,
        index: sc.index,
      },
      include: {
        section: { select: { uuid: true } },
        component: { select: { uuid: true } },
      },
    });
    return this.toDomain(updated);
  }

  async delete(uuid: string): Promise<boolean> {
    await this.prisma.sectionComponent.delete({ where: { uuid } });
    return true;
  }

  private toDomain(record: any): SectionComponent {
    return {
      id: record.uuid,
      sectionId: record.section?.uuid ?? '',
      componentId: record.component?.uuid ?? '',
      componentData: record.componentData,
      componentSettings: record.componentSettings,
      index: record.index,
    };
  }
}

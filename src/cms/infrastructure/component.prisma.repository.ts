import { Injectable } from '@nestjs/common';
import { Component, IComponentRepository } from '../domain/cms.types';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class ComponentPrismaRepository implements IComponentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUuid(uuid: string): Promise<Component | null> {
    const record = await this.prisma.component.findUnique({
      where: { uuid },
      include: { parent: { select: { uuid: true } } },
    });
    return record ? this.toDomain(record) : null;
  }

  async findManyByUuids(uuids: string[]): Promise<Component[]> {
    const records = await this.prisma.component.findMany({
      where: { uuid: { in: uuids } },
      include: { parent: { select: { uuid: true } } },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findAll(): Promise<Component[]> {
    const records = await this.prisma.component.findMany({
      include: { parent: { select: { uuid: true } } },
      orderBy: { index: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async save(component: Component): Promise<Component | null> {
    // get parent integer ID if parentId is provided
    let parentIntId: number | null = null;
    if (component.parentId) {
      const parent = await this.prisma.component.findUnique({
        where: { uuid: component.parentId },
      });
      if (!parent)
        throw new Error(
          `Parent component with UUID ${component.parentId} not found`,
        );
      parentIntId = parent.id;
    }

    const result = await this.prisma.component.upsert({
      where: { uuid: component.id },
      update: {
        nameEN: component.nameEN,
        nameAR: component.nameAR,
        index: component.index,
        parentId: parentIntId,
      },
      create: {
        uuid: component.id,
        nameEN: component.nameEN,
        nameAR: component.nameAR,
        index: component.index,
        parentId: parentIntId,
      },
      include: { parent: { select: { uuid: true } } },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(
    componentUuid: string,
    component: Partial<Component>,
  ): Promise<Component | null> {
    // get parent integer ID if parentId is provided
    let parentIntId: number | null = null;
    if (component.parentId) {
      const parent = await this.prisma.component.findUnique({
        where: { uuid: component.parentId },
      });
      if (!parent)
        throw new Error(
          `Parent component with UUID ${component.parentId} not found`,
        );
      parentIntId = parent.id;
    }

    const result = await this.prisma.component.update({
      where: { uuid: componentUuid },
      data: {
        nameEN: component.nameEN,
        nameAR: component.nameAR,
        index: component.index,
        parentId: parentIntId,
      },
    });
    return result ? this.toDomain(result) : null;
  }

  async delete(uuid: string): Promise<boolean> {
    await this.prisma.component.delete({ where: { uuid } });
    return true;
  }

  private toDomain(record: any): Component {
    return {
      id: record.uuid,
      nameEN: record.nameEN,
      nameAR: record.nameAR,
      index: record.index,
      parentId: record.parent?.uuid ?? null,
    };
  }
}

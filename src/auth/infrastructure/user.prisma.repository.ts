import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { IUserRepository } from '../domain/auth.types';
import { User } from '../domain/auth.types';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    return user ? this.toDomain(user) : null;
  }

  async findByUuid(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { uuid: id } });
    return user ? this.toDomain(user) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { uuid: user.id },
      update: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      create: {
        uuid: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  private toDomain(prismaUser: any): User {
    return {
      id: prismaUser.uuid,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
    };
  }
}

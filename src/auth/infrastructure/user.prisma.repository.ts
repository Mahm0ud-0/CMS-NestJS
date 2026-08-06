import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { IUserRepository } from '../domain/auth.repository.interface';
import { User } from '../domain/auth.entities';

@Injectable()
export class UserPrismaRepository extends IUserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    return user ? this.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    return user ? this.toDomain(user) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  private toDomain(prismaUser: any): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}

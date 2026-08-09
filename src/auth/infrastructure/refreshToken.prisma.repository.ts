import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { IRefreshTokenRepository } from '../domain/auth.types';
import { RefreshToken } from '../domain/auth.types';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class RefreshTokenPrismaRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTokenHash(hash: string): Promise<RefreshToken | null> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
      include: { user: true },
    });
    return record ? this.toDomain(record) : null;
  }

  async save(token: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        uuid: token.id,
        tokenHash: token.tokenHash,
        expiresAt: token.expiresAt,
        revoked: token.revoked,
        user: {
          connect: { uuid: token.userId },
        },
      },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        user: {
          uuid: userId,
        },
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  async revoke(token: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { uuid: token.id },
      data: { revoked: true },
    });
  }

  private toDomain(
    prismaToken: Prisma.RefreshTokenGetPayload<{
      include: { user: true };
    }>,
  ): RefreshToken {
    return {
      id: prismaToken.uuid,
      tokenHash: prismaToken.tokenHash,
      userId: prismaToken.user.uuid,
      expiresAt: prismaToken.expiresAt,
      revoked: prismaToken.revoked,
    };
  }
}

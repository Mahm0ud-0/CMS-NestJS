import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { IRefreshTokenRepository } from '../domain/auth.repository.interface';
import { RefreshToken } from '../domain/auth.entities';

@Injectable()
export class RefreshTokenPrismaRepository extends IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByTokenHash(hash: string): Promise<RefreshToken | null> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
    });
    return record ? this.toDomain(record) : null;
  }

  async save(token: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        id: token.id,
        tokenHash: token.tokenHash,
        userId: token.userId,
        expiresAt: token.expiresAt,
        createdAt: token.createdAt,
        revoked: token.revoked,
      },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async revoke(token: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: token.id },
      data: { revoked: true },
    });
  }

  private toDomain(prismaToken: any): RefreshToken {
    return new RefreshToken(
      prismaToken.id,
      prismaToken.tokenHash,
      prismaToken.userId,
      prismaToken.expiresAt,
      prismaToken.createdAt,
      prismaToken.revoked,
    );
  }
}

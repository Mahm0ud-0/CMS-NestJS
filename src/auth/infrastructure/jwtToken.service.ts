import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'crypto';
import { ITokenService } from '../application/services.interface';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: { id: string; name: string }): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(): {
    token: string;
    hash: string;
    expiresAt: Date;
  } {
    const token = randomBytes(64).toString('hex');
    const hash = createHash('sha256').update(token).digest('hex');
    const expiresInMs = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs);
    return { token, hash, expiresAt };
  }

  verifyAccessToken(token: string): { id: string; name: string } {
    const decoded: { id: string; name: string } = this.jwtService.verify(token);
    return decoded;
  }
}

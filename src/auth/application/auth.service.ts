import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IRefreshTokenRepository,
  IUserRepository,
} from '../domain/auth.repository.interface';
import { IPasswordHasher, ITokenService } from './services.abstract';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshToken, User } from '../domain/auth.entities';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ForbiddenException('User already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = new User(
      crypto.randomUUID(),
      dto.name,
      dto.email,
      hashedPassword,
    );

    await this.userRepo.save(user);

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      name: user.name,
    });

    const {
      token: refreshToken,
      hash,
      expiresAt,
    } = this.tokenService.generateRefreshToken();

    const refreshTokenEntity = new RefreshToken(
      crypto.randomUUID(),
      hash,
      user.id,
      expiresAt,
      new Date(),
      false,
    );
    await this.refreshTokenRepo.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      name: user.name,
    });

    const {
      token: refreshToken,
      hash,
      expiresAt,
    } = this.tokenService.generateRefreshToken();

    const refreshTokenEntity = new RefreshToken(
      crypto.randomUUID(),
      hash,
      user.id,
      expiresAt,
      new Date(),
      false, // not revoked
    );
    await this.refreshTokenRepo.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken, // raw token, controller will put it in cookie
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async refresh(oldRefreshToken: string): Promise<AuthResponseDto> {
    const hash = this.hashToken(oldRefreshToken);

    const storedToken = await this.refreshTokenRepo.findByTokenHash(hash);
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    if (storedToken.revoked) {
      await this.refreshTokenRepo.revokeAllForUser(storedToken.userId);
      throw new Error('Token in no longer valid, Please Login.');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepo.revoke(storedToken);
      throw new Error('Refresh token expired');
    }

    await this.refreshTokenRepo.revoke(storedToken);

    const user = await this.userRepo.findById(storedToken.userId);
    if (!user) throw new Error('User not found');

    const newAccessToken = this.tokenService.generateAccessToken({
      id: user.id,
      name: user.name,
    });

    const {
      token: newRefreshToken,
      hash: newHash,
      expiresAt: newExpiresAt,
    } = this.tokenService.generateRefreshToken();

    const newTokenEntity = new RefreshToken(
      crypto.randomUUID(),
      newHash,
      user.id,
      newExpiresAt,
      new Date(),
      false,
    );
    await this.refreshTokenRepo.save(newTokenEntity);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const hash = this.hashToken(refreshToken);
    const storedToken = await this.refreshTokenRepo.findByTokenHash(hash);
    if (storedToken) {
      await this.refreshTokenRepo.revoke(storedToken);
    }
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

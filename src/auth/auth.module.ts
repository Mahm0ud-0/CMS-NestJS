import { Module } from '@nestjs/common';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import {
  I_Refresh_Token_Repository,
  I_User_Repository,
} from './domain/auth.types';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { RefreshTokenPrismaRepository } from './infrastructure/refreshToken.prisma.repository';
import {
  I_Password_Hasher,
  I_Token_Service,
} from './application/services.interface';
import { JwtTokenService } from './infrastructure/jwtToken.service';
import { BcryptPasswordHasher } from './infrastructure/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/http/auth.controller';
import { AuthService } from './application/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './presentation/gaurds/auth.guard';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('ACCESS_SECRET_KEY');
        console.log('JWT_SECRET from ConfigService:', secret);
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { provide: I_User_Repository, useClass: UserPrismaRepository },
    {
      provide: I_Refresh_Token_Repository,
      useClass: RefreshTokenPrismaRepository,
    },
    { provide: I_Token_Service, useClass: JwtTokenService },
    { provide: I_Password_Hasher, useClass: BcryptPasswordHasher },

    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { RefreshToken, User } from './auth.entities';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
}

export abstract class IRefreshTokenRepository {
  abstract findByTokenHash(hash: string): Promise<RefreshToken | null>;
  abstract save(token: RefreshToken): Promise<void>;
  abstract revokeAllForUser(userId: string): Promise<void>;
  abstract revoke(token: RefreshToken): Promise<void>;
}

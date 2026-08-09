export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface RefreshToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  revoked: boolean;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUuid(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface IRefreshTokenRepository {
  findByTokenHash(hash: string): Promise<RefreshToken | null>;
  save(token: RefreshToken): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  revoke(token: RefreshToken): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
export const IRefreshTokenRepository = Symbol('IRefreshTokenRepository');

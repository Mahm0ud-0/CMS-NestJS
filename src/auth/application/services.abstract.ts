export abstract class ITokenService {
  abstract generateAccessToken(payload: { id: string; name: string }): string; // userId
  abstract generateRefreshToken(): {
    token: string;
    hash: string;
    expiresAt: Date;
  };
  abstract verifyAccessToken(token: string): { id: string; name: string }; // returns {id, name}
  // abstract verifyRefreshToken(token: string): string; // returns userId (or validates)
}
export abstract class IPasswordHasher {
  abstract hash(password: string): Promise<string>;
  abstract compare(password: string, hash: string): Promise<boolean>;
}

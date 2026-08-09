export interface ITokenService {
  generateAccessToken(payload: { id: string; name: string }): string; // userId
  generateRefreshToken(): {
    token: string;
    hash: string;
    expiresAt: Date;
  };
  verifyAccessToken(token: string): { id: string; name: string }; // returns {id, name}
  //  verifyRefreshToken(token: string): string; // returns userId (or validates)
}
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export const I_Token_Service = Symbol('ITokenService');
export const I_Password_Hasher = Symbol('IPasswordHasher');

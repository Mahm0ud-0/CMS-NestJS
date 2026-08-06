export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly tokenHash: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly revoked: boolean,
  ) {}
}

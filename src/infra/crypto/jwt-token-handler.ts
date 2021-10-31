import { TockenGenerator, TokenValidator } from '@/domain/contracts/crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class JwtTokenHandler implements TockenGenerator, TokenValidator {
  constructor(private readonly secret: string) {}

  async generateToken({
    expirationInMs,
    key
  }: TockenGenerator.Params): Promise<TockenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000;
    return jwt.sign({ key }, this.secret, {
      expiresIn: expirationInSeconds
    });
  }

  async validateToken({
    token
  }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = jwt.verify(token, this.secret) as JwtPayload;
    return payload.key;
  }
}

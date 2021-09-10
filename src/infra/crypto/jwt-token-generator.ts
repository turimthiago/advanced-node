import { TockenGenerator } from '@/data/contracts/crypto';
import jwt from 'jsonwebtoken';

export class JwtTokenGenerator implements TockenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(
    params: TockenGenerator.Params
  ): Promise<TockenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    return jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    });
  }
}

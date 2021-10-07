import { TockenGenerator } from '@/data/contracts/crypto';
import jwt from 'jsonwebtoken';

type Params = TockenGenerator.Params;
type Result = TockenGenerator.Result;
export class JwtTokenGenerator implements TockenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken({ expirationInMs, key }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000;
    return jwt.sign({ key }, this.secret, {
      expiresIn: expirationInSeconds
    });
  }
}

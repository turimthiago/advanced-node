import { TockenGenerator } from '@/data/contracts/crypto';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(params: TockenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000;
    jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    });
  }
}

describe('JwtTokenGenerator', () => {
  let fakeJwt: jest.Mocked<typeof jwt>;
  let sut: JwtTokenGenerator;
  let secret: string;

  beforeEach(() => {
    secret = 'any_secret';
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    sut = new JwtTokenGenerator(secret);
  });

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 });
    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: 'any_key' },
      'any_secret',
      { expiresIn: 1 }
    );
  });
});

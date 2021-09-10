import jwt from 'jsonwebtoken';
import { JwtTokenGenerator } from '@/infra/crypto';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  let fakeJwt: jest.Mocked<typeof jwt>;
  let sut: JwtTokenGenerator;
  let secret: string;

  beforeEach(() => {
    secret = 'any_secret';
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
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

  it('should return a token', async () => {
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    });
    expect(token).toBe('any_token');
  });

  it('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error');
    });
    const promise = sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    });
    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});

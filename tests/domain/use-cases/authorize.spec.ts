import { AuthenticationError } from '@/domain/entities/errors';
import {
  FacebookAuthentication,
  setupFacebookAuthentication
} from '@/domain/use-cases';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/domain/contracts/repos';

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>;
}

namespace TokenValidator {
  export type Params = { token: string };
}

type Setup = (crypto: TokenValidator) => Authorize;
type Input = { token: string };
type Authorize = (params: Input) => Promise<void>;

const setupAuthorize: Setup = (crypto) => {
  return async (params) => {
    crypto.validateToken(params);
    return;
  };
};

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>;
  let sut: Authorize;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    crypto = mock();
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  });

  it('should call TokenValidator with correct values', async () => {
    await sut({ token });
    expect(crypto.validateToken).toHaveBeenCalledWith({ token });
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });
});

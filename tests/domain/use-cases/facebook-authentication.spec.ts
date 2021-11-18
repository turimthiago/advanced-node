import { AuthenticationError } from '@/domain/entities/errors';
import {
  FacebookAuthentication,
  setupFacebookAuthentication
} from '@/domain/use-cases';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUser } from '@/domain/contracts/gateways';
import { SaveFacebookAccount, LoadUserAccount } from '@/domain/contracts/repos';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { TockenGenerator } from '@/domain/contracts/gateways';

import { mocked } from 'ts-jest/utils';

jest.mock('@/domain/entities/facebook-account');

describe('Facebook  Authentication', () => {
  let facebookApi: MockProxy<LoadFacebookUser>;
  let crypto: MockProxy<TockenGenerator>;
  let userAccountRepository: MockProxy<LoadUserAccount & SaveFacebookAccount>;
  let sut: FacebookAuthentication;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookApi = mock<LoadFacebookUser>();
    userAccountRepository = mock<LoadUserAccount & SaveFacebookAccount>();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    });
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_facebook@mail.com',
      facebookId: 'any_fb_id'
    });
    crypto = mock();
    crypto.generate.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebookApi,
      userAccountRepository,
      crypto
    );
  });

  it('should call LoadFacebookUser with correct values', async () => {
    await sut({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const promise = sut({ token });
    await expect(promise).rejects.toThrow(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepo when LoadFacebookUser returns data', async () => {
    await sut({ token });
    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_facebook@mail.com'
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call SaveFacebookAccount with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }));
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);
    await sut({ token });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut({ token });
    expect(crypto.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    });
    expect(crypto.generate).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut({ token });
    expect(authResult).toEqual({ accessToken: 'any_generated_token' });
  });

  it('should retrow if LoadFacebookApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('Facebook Error'));
    const promise = sut({ token });
    await expect(promise).rejects.toThrow(new Error('Facebook Error'));
  });

  it('should retrow if LoadUserAccount throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('Load Error'));
    const promise = sut({ token });
    await expect(promise).rejects.toThrow(new Error('Load Error'));
  });

  it('should retrow if SaveFacebookAccount throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(
      new Error('Save Error')
    );
    const promise = sut({ token });
    await expect(promise).rejects.toThrow(new Error('Save Error'));
  });

  it('should retrow if GeneratorToken throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('GeneratorToken Error'));
    const promise = sut({ token });
    await expect(promise).rejects.toThrow(new Error('GeneratorToken Error'));
  });
});

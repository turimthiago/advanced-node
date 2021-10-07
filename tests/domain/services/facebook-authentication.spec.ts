import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/domain/services';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/domain/contracts/repos';
import { AccessToken, FacebookAccount } from '@/domain/models';
import { mocked } from 'ts-jest/utils';
import { TockenGenerator } from '../contracts/crypto';

jest.mock('@/domain/models/facebook-account');

describe('Facebook AuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TockenGenerator>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookApi = mock<LoadFacebookUserApi>();
    userAccountRepository = mock<
      LoadUserAccountRepository & SaveFacebookAccountRepository
    >();
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
    crypto.generateToken.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
    );
  });

  it('should call LoadFacebookUserApi with correct values', async () => {
    await sut.perform({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });
    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_facebook@mail.com'
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }));
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);
    await sut.perform({ token });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token });
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });

  it('should retrow if LoadFacebookApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('Facebook Error'));
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(new Error('Facebook Error'));
  });

  it('should retrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('Load Error'));
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(new Error('Load Error'));
  });

  it('should retrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(
      new Error('Save Error')
    );
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(new Error('Save Error'));
  });

  it('should retrow if GeneratorToken throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(
      new Error('GeneratorToken Error')
    );
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(new Error('GeneratorToken Error'));
  });
});

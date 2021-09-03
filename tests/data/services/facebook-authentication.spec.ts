import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/data/repos';
import { FacebookAccount } from '@/domain/models';

import { mocked } from 'ts-jest/utils';

jest.mock('@/domain/models/facebook-account');

describe('Facebook AuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
  LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = { token: 'any_token' };

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>();
    userAccountRepository = mock<
    LoadUserAccountRepository & SaveFacebookAccountRepository
    >();
    userAccountRepository.load.mockResolvedValue(undefined);
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_facebook@mail.com',
      facebookId: 'any_fb_id'
    });
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository);
  });

  it('should call LoadFacebookUserApi with correct values', async () => {
    await sut.perform(token);
    expect(facebookApi.loadUser).toHaveBeenCalledWith(token);
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform(token);
    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform(token);
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
    await sut.perform(token);
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});

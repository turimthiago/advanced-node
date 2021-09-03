import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/data/repos';

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

  it('should create account with facebook data', async () => {
    await sut.perform(token);
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      email: 'any_facebook@mail.com',
      facebookId: 'any_fb_id',
      name: 'any_fb_name'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should not account update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_fb_name'
    });
    await sut.perform(token);
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      facebookId: 'any_fb_id',
      email: 'any_facebook@mail.com',
      name: 'any_fb_name'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id'
    });
    await sut.perform(token);
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
      email: 'any_facebook@mail.com'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';
import { LoadUserAccountRepository } from '@/data/repos';

describe('Facebook AuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = { token: 'any_token' };

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadUserAccountRepo = mock<LoadUserAccountRepository>();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_facebook@mail.com',
      facebookId: 'any_id'
    });
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo);
  });

  it('should call LoadFacebookUserApi with correct values', async () => {
    await sut.perform(token);
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(token);
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform(token);
    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform(token);
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook@mail.com' });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
});

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { mock } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';

describe('Facebook AuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct values', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    await sut.perform({ token: 'any_token' });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    const authResult = await sut.perform({ token: 'any_token' });
    expect(authResult).toEqual(new AuthenticationError());
  });
});

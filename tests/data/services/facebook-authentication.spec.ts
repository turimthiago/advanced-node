import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';

describe('Facebook AuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;

  beforeAll(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  });

  it('should call LoadFacebookUserApi with correct values', async () => {
    await sut.perform({ token: 'any_token' });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token: 'any_token' });
    expect(authResult).toEqual(new AuthenticationError());
  });
});

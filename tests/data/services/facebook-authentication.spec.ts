import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook';
class LoadFacebookUserByTokenApiSpy implements LoadFacebookUserApi {
  token?: string;
  result: undefined;

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe('Facebook AuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct values', async () => {
    const loadFacebookUserByTokenApi = new LoadFacebookUserByTokenApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi);
    await sut.perform({ token: 'any_token' });
    expect(loadFacebookUserByTokenApi.token).toBe('any_token');
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserByTokenApi = new LoadFacebookUserByTokenApiSpy();
    loadFacebookUserByTokenApi.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi);
    const authResult = await sut.perform({ token: 'any_token' });
    expect(authResult).toEqual(new AuthenticationError());
  });
});

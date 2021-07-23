import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
    return new AuthenticationError();
  }
}

interface LoadFacebookUserApi{
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

export namespace LoadFacebookUserApi{
  export interface Params {
    token: string
  }
  export type Result = undefined;
}

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

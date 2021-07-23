import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook';
import { AuthenticationError } from '@/domain/errors';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
    return new AuthenticationError();
  }
}

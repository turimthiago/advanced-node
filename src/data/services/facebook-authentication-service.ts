import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook';
import { AuthenticationError } from '@/domain/errors';
import { LoadUserAccountRepository } from '@/data/repos';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi, private readonly loadUserAccountRepository: LoadUserAccountRepository) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(params);
    if (fbData != null) await this.loadUserAccountRepository.load({ email: fbData?.email });
    return new AuthenticationError();
  }
}

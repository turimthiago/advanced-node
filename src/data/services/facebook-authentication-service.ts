import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook';
import { AuthenticationError } from '@/domain/errors';
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/repos';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData != null) {
      await this.userAccountRepository.load({ email: fbData.email });
      await this.userAccountRepository.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}

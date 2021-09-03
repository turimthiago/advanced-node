import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook';
import { AuthenticationError } from '@/domain/errors';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/repos';
import { FacebookAccount } from '@/domain/models/facebook-account';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: fbData.email });
      const facebookAccount = new FacebookAccount(fbData, accountData);
      await this.userAccountRepository.saveWithFacebook(facebookAccount);
    }
    return new AuthenticationError();
  }
}

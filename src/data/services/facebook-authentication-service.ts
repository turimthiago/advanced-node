import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook';
import { AuthenticationError } from '@/domain/errors';
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/repos';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData != null) {
      const accountData = await this.userAccountRepository.load({ email: fbData.email });
      if (accountData?.name !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: fbData.facebookId
        });
      } else {
        await this.userAccountRepository.createFromFacebook(fbData);
      }
    }
    return new AuthenticationError();
  }
}

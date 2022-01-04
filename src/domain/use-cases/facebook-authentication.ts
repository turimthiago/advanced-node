import { LoadFacebookUser } from '@/domain/contracts/gateways';
import { AuthenticationError } from '@/domain/entities/errors';
import { SaveFacebookAccount, LoadUserAccount } from '@/domain/contracts/repos';
import { FacebookAccount } from '@/domain/entities/facebook-account';
import { TockenGenerator } from '@/domain/contracts/gateways';
import { AccessToken } from '@/domain/entities';

type Output = { accessToken: string };
type Input = { token: string };

export type FacebookAuthentication = (params: Input) => Promise<Output>;
type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepository: LoadUserAccount & SaveFacebookAccount,
  token: TockenGenerator
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup =
  (facebook, userAccountRepository, token) => async (params) => {
    const fbData = await facebook.loadUser(params);
    if (fbData !== undefined) {
      const accountData = await userAccountRepository.load({
        email: fbData.email
      });
      const facebookAccount = new FacebookAccount(fbData, accountData);
      const { id } = await userAccountRepository.saveWithFacebook(
        facebookAccount
      );
      const accessToken = await token.generate({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      });
      return { accessToken };
    }
    throw new AuthenticationError();
  };

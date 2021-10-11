import { LoadFacebookUserApi } from '@/domain/contracts/apis/facebook';
import { AuthenticationError } from '@/domain/entities/errors';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/domain/contracts/repos';
import { FacebookAccount } from '@/domain/entities/facebook-account';
import { TockenGenerator } from '../contracts/crypto';
import { AccessToken } from '@/domain/entities';

export type FacebookAuthentication = (params: {
  token: string;
}) => Promise<{ accessToken: string }>;
type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepository: LoadUserAccountRepository &
    SaveFacebookAccountRepository,
  crypto: TockenGenerator
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup =
  (facebookApi, userAccountRepository, crypto) => async (params) => {
    const fbData = await facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountData = await userAccountRepository.load({
        email: fbData.email
      });
      const facebookAccount = new FacebookAccount(fbData, accountData);
      const { id } = await userAccountRepository.saveWithFacebook(
        facebookAccount
      );
      const accessToken = await crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      });
      return { accessToken };
    }
    throw new AuthenticationError();
  };

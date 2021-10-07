import { FacebookAuthentication } from '@/domain/features';
import { FacebookAuthenticationService } from '@/domain/services';
import { makeFacebookApi } from '@/main/factories/apis/facebook';
import { makePgUserAccountRepository } from '@/main/factories/repositories';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';

export const makeFacebookAuthenticationService = (): FacebookAuthentication => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenGenerator()
  );
};

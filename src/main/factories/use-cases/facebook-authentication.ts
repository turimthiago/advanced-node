import { FacebookAuthentication } from '@/domain/features';
import { FacebookAuthenticationUsecase } from '@/domain/use-cases';
import { makeFacebookApi } from '@/main/factories/apis/facebook';
import { makePgUserAccountRepository } from '@/main/factories/repositories';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return new FacebookAuthenticationUsecase(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenGenerator()
  );
};

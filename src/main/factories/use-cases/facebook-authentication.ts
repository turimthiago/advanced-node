import {
  FacebookAuthentication,
  setupFacebookAuthentication
} from '@/domain/use-cases';
import { makeFacebookApi } from '@/main/factories/gateways/facebook';
import { makePgUserAccountRepository } from '@/main/factories/repositories';
import { makeJwtTokenGenerator } from '@/main/factories/gateways';

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenGenerator()
  );
};

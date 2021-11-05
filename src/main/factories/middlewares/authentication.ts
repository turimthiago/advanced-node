import { setupAuthorize } from '@/domain/use-cases';
import { AuthenticationMiddleware } from '@/application/middlewares';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const authorize = setupAuthorize(makeJwtTokenGenerator());
  return new AuthenticationMiddleware(authorize);
};

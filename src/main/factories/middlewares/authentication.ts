import { AuthenticationMiddleware } from '@/application/middlewares';
import { makeJwtTokenGenerator } from '@/main/factories/gateways';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenGenerator();
  return new AuthenticationMiddleware(jwt.validate.bind(jwt));
};

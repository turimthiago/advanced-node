import { JwtTokenHandler } from '@/infra/crypto';
import { env } from '@/main/config/env';

export const makeJwtTokenGenerator = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret);
};

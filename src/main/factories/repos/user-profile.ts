import { PgUserProfileRepository } from '@/infra/repos/postgres';
import { PgConnection } from '@/infra/repos/postgres/helpers';

export const makePgUserProfileRepo = (): PgUserProfileRepository => {
  return new PgUserProfileRepository(PgConnection.getInstance());
};

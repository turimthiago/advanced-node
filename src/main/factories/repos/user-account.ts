import { PgUserAccountRepository } from '@/infra/repos/postgres';
import { PgConnection } from '@/infra/repos/postgres/helpers';

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository(PgConnection.getInstance());
};

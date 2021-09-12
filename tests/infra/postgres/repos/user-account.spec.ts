import { IBackup, IMemoryDb, newDb } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';
import { PgUserAccountRepository } from '@/infra/postgres/repos';

const makeFakedb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  });
  await connection.synchronize();
  return db;
};

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepository: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakedb([PgUser]);
    backup = db.backup();
    pgUserRepository = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository();
  });

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'exists@mail.com' });
      const sut = new PgUserAccountRepository();
      const account = await sut.load({ email: 'exists@mail.com' });
      expect(account).toEqual({ id: '1' });
    });

    it('should return undefined if does not exists', async () => {
      const account = await sut.load({ email: 'notexists@mail.com' });
      expect(account).toBeUndefined();
    });
  });
});

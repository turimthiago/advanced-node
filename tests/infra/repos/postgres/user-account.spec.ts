import { PgUser } from '@/infra/repos/postgres/entities';
import { PgRepository, PgUserAccountRepository } from '@/infra/repos/postgres';
import { makeFakedb } from '@/tests/infra/repos/postgres/mocks';
import { PgConnection } from '@/infra/repos/postgres/helpers';

import { IBackup } from 'pg-mem';
import { Repository } from 'typeorm';

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepository: Repository<PgUser>;
  let connection: PgConnection;
  let backup: IBackup;

  beforeAll(async () => {
    connection = PgConnection.getInstance();
    const db = await makeFakedb([PgUser]);
    backup = db.backup();
    pgUserRepository = connection.getRepository(PgUser);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository(PgConnection.getInstance());
  });

  it('should extends PgRepository', async () => {
    expect(sut).toBeInstanceOf(PgRepository);
  });

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'exists@mail.com' });
      const account = await sut.load({ email: 'exists@mail.com' });
      expect(account).toEqual({ id: '1', name: null });
    });

    it('should return undefined if does not exists', async () => {
      const account = await sut.load({ email: 'notexists@mail.com' });
      expect(account).toBeUndefined();
    });
  });

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: ' any_name',
        facebookId: 'any_fb_id'
      });
      const pgUser = await pgUserRepository.findOne({ email: 'any_email' });
      expect(pgUser?.id).toBe(1);
      expect(id).toBe('1');
    });

    it('should update an account id is defined', async () => {
      await pgUserRepository.save({
        email: 'any_email',
        name: ' any_name',
        facebookId: 'any_fb_id'
      });
      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: ' new_name',
        facebookId: 'new_fb_id'
      });
      const pgUser = await pgUserRepository.findOne({ id: 1 });
      expect(pgUser).toMatchObject({
        id: 1,
        email: 'any_email',
        name: ' new_name',
        facebookId: 'new_fb_id'
      });
      expect(id).toBe('1');
    });
  });
});

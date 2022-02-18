import { PgUser } from '@/infra/repos/postgres/entities';
import { makeFakedb } from '@/tests/infra/repos/postgres/mocks';
import { PgRepository, PgUserProfileRepository } from '@/infra/repos/postgres';
import { PgConnection } from '@/infra/repos/postgres/helpers';

import { IBackup } from 'pg-mem';
import { Repository } from 'typeorm';

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository;
  let connection: PgConnection;
  let pgUserRepository: Repository<PgUser>;
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
    sut = new PgUserProfileRepository(PgConnection.getInstance());
  });

  it('should extends PgRepository', async () => {
    expect(sut).toBeInstanceOf(PgRepository);
  });

  describe('savePicture', () => {
    it('should update User profile', async () => {
      const { id } = await pgUserRepository.save({
        email: 'any_email',
        initials: 'any_initials'
      });
      await sut.savePicture({
        id: id.toString(),
        pictureUrl: 'any_url'
      });
      const pgUser = await pgUserRepository.findOne({ id });
      expect(pgUser).toMatchObject({
        id,
        pictureUrl: 'any_url',
        initials: null
      });
    });
  });

  describe('loadPicture', () => {
    it('should load User profile', async () => {
      const { id } = await pgUserRepository.save({
        email: 'any_email',
        name: 'any_name'
      });
      const userProfile = await sut.load({
        id: id.toString()
      });
      expect(userProfile?.name).toBe('any_name');
    });

    it('should load User profile', async () => {
      const { id } = await pgUserRepository.save({
        email: 'any_email'
      });
      const userProfile = await sut.load({
        id: id.toString()
      });
      expect(userProfile?.name).toBeUndefined();
    });

    it('should return undefined', async () => {
      const invliadId = '1';
      const userProfile = await sut.load({
        id: invliadId
      });
      expect(userProfile?.name).toBeUndefined();
    });
  });
});

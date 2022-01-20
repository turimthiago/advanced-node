import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';
import { PgUser } from '@/infra/repos/postgres/entities';
import { makeFakedb } from '@/../tests/infra/repos/postgres/mocks';
import { PgUserProfileRepository } from '@/infra/repos/postgres';

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository;
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
    sut = new PgUserProfileRepository();
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

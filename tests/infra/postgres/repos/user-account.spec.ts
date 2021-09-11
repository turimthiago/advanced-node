import { LoadUserAccountRepository } from '@/data/repos';
import { IBackup, newDb } from 'pg-mem';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  getRepository,
  Repository,
  Connection,
  getConnection
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: number;
}

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser);
    const pgUser = await pgUserRepository.findOne({ email: params.email });
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      };
    }
  }
}

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepository: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser]
    });
    await connection.synchronize();
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

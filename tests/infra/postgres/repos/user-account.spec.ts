import { LoadUserAccountRepository } from '@/data/repos';
import { newDb } from 'pg-mem';
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm';

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
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      });
      await connection.synchronize();
      const pgUserRepository = getRepository(PgUser);
      await pgUserRepository.save({ email: 'existing_email' });
      const sut = new PgUserAccountRepository();
      const account = await sut.load({ email: 'existing_email' });
      expect(account).toEqual({ id: '1' });
    });
  });
});

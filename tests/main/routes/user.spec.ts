import { PgUser } from '@/infra/repos/postgres/entities';
import { app } from '@/main/config/app';
import { makeFakedb } from '@/tests/infra/repos/postgres/mocks';
import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { env } from '@/main/config/env';

describe('User Routes', () => {
  let backup: IBackup;
  let pgUserRepository: Repository<PgUser>;

  beforeAll(async () => {
    const db = await makeFakedb([PgUser]);
    pgUserRepository = getRepository(PgUser);
    backup = db.backup();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
  });

  describe('DELETE /users/picture', () => {
    it('should return 403 if not authorization header is present', async () => {
      const { status } = await request(app).delete('/api/users/picture');
      expect(status).toBe(403);
    });

    it('should return 200 with valid data', async () => {
      const { id } = await pgUserRepository.save({
        email: 'any_email',
        name: 'Thiago Turim'
      });
      const authorization = sign({ key: id }, env.jwtSecret);
      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization });
      expect(status).toBe(200);
      expect(body).toEqual({ initials: 'TT' });
    });
  });

  describe('PUT /users/picture', () => {
    it('should return 403 if not authorization header is present', async () => {
      const { status } = await request(app).put('/api/users/picture');
      expect(status).toBe(403);
    });
  });
});

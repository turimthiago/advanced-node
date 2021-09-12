import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/repos';
import { getRepository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';

export class PgUserAccountRepository implements LoadUserAccountRepository {
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

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params
  ): Promise<void> {
    const pgUserRepository = getRepository(PgUser);
    await pgUserRepository.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId
    });
  }
}
